import { Service } from "typedi";

import * as grpc from "@grpc/grpc-js";
import { WriteApi, ReadApi } from "@ory/keto-client";
import writeService from "@ory/keto-grpc-client/write_service_grpc_pb.js";
import acl from "@ory/keto-grpc-client/acl_pb.js";
import writeData from "@ory/keto-grpc-client/write_service_pb.js";
import checkService from "@ory/keto-grpc-client/check_service_grpc_pb.js";
import checkData from "@ory/keto-grpc-client/check_service_pb.js";
import config from "../../config";

@Service()
export abstract class BaseRBACService {
  abstract readonly namespace: string;
  abstract readonly actions: string[];
  abstract readonly rolesMapping: Record<string, string[]>;

  private readonly member = "member";
  private writeClient: writeService.WriteServiceClient;
  private checkClient: checkService.CheckServiceClient;

  constructor() {
    this.writeClient = new writeService.WriteServiceClient(
      config.keto.write_url,
      grpc.credentials.createInsecure()
    );

    this.checkClient = new checkService.CheckServiceClient(
      config.keto.read_url,
      grpc.credentials.createInsecure()
    );
  }

  private createResourceGroupName(resourceId: string, role: string) {
    return `${resourceId}-${role}`;
  }

  private async writeTuple(
    writeRequest: writeData.TransactRelationTuplesRequest
  ) {
    return new Promise<void>((resolve, reject) => {
      this.writeClient.transactRelationTuples(writeRequest, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private async checkTuple(
    checkRequest: checkData.CheckRequest
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.checkClient.check(checkRequest, (error, resp) => {
        if (error) {
          reject(error);
        } else {
          resolve(resp.getAllowed());
        }
      });
    });
  }

  private sentTuple(
    objectId: string,
    relation: string,
    sub: acl.Subject,
    action: writeData.RelationTupleDelta.Action
  ) {
    const relationTuple = new acl.RelationTuple();
    relationTuple.setNamespace(this.namespace);
    relationTuple.setObject(objectId);
    relationTuple.setRelation(relation);
    relationTuple.setSubject(sub);

    const tupleDelta = new writeData.RelationTupleDelta();
    tupleDelta.setAction(action);
    tupleDelta.setRelationTuple(relationTuple);

    const writeRequest = new writeData.TransactRelationTuplesRequest();
    writeRequest.addRelationTupleDeltas(tupleDelta);
    return this.writeTuple(writeRequest);
  }

  private insertRule(objectId: string, relation: string, sub: acl.Subject) {
    return this.sentTuple(
      objectId,
      relation,
      sub,
      writeData.RelationTupleDelta.Action.INSERT
    );
  }

  private deleteRule(objectId: string, relation: string, sub: acl.Subject) {
    return this.sentTuple(
      objectId,
      relation,
      sub,
      writeData.RelationTupleDelta.Action.DELETE
    );
  }

  async setupRoles(resourceId: string) {
    await Promise.all(
      Object.keys(this.rolesMapping).flatMap((role) => {
        return this.rolesMapping[role].map((action) => {
          const subjectSet = new acl.SubjectSet();
          subjectSet.setNamespace(this.namespace);
          subjectSet.setObject(this.createResourceGroupName(resourceId, role));
          subjectSet.setRelation(this.member);
          const sub = new acl.Subject();
          sub.setSet(subjectSet);
          return this.insertRule(resourceId, action, sub);
        });
      })
    );
  }

  async deleteRoles(resourceId: string) {
    await Promise.all(
      Object.keys(this.rolesMapping).flatMap((role) => {
        // TODO: delete roles binding members
        return this.rolesMapping[role].map((action) => {
          const subjectSet = new acl.SubjectSet();
          subjectSet.setNamespace(this.namespace);
          subjectSet.setObject(this.createResourceGroupName(resourceId, role));
          subjectSet.setRelation(this.member);
          const sub = new acl.Subject();
          sub.setSet(subjectSet);
          return this.deleteRule(resourceId, action, sub);
        });
      })
    );
  }

  async setUserRole(resourseId: string, userId: string, role: string) {
    const sub = new acl.Subject();
    sub.setId(userId);
    return this.insertRule(
      this.createResourceGroupName(resourseId, role),
      this.member,
      sub
    );
  }

  async isAllowedAction(
    resourseId: string,
    action: string,
    userId: string
  ): Promise<boolean> {
    const checkRequest = new checkData.CheckRequest();
    checkRequest.setNamespace(this.namespace);
    checkRequest.setObject(resourseId);
    checkRequest.setRelation(action);

    const sub = new acl.Subject();
    sub.setId(userId);
    checkRequest.setSubject(sub);

    return this.checkTuple(checkRequest);
  }
}

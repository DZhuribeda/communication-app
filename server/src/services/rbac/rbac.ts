import { Service } from "typedi";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

import config from "../../config";

@Service()
class KetoClient {
  async checkRelationTuple(
    namespace: string,
    object: string,
    relation: string,
    subject: string
  ): Promise<boolean> {
    console.log("READ", object, relation, subject);
    const resp = await fetch(`${config.keto.read_url}/check`, {
      method: "POST",
      body: JSON.stringify({
        namespace: namespace,
        object: object,
        relation: relation,
        subject: subject,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await resp.json();
    console.log(data);
    return data.allowed;
  }

  async createRelationTuple(
    namespace: string,
    object: string,
    relation: string,
    subject: string
  ) {
    await fetch(`${config.keto.write_url}/relation-tuples`, {
      method: "put",
      body: JSON.stringify({
        namespace: namespace,
        object: object,
        relation: relation,
        subject: subject,
      }),
      headers: { "Content-Type": "application/json" },
    });
  }

  async deleteRelationTuple(
    namespace: string,
    object: string,
    relation: string,
    subject: string
  ) {
    const search = new URLSearchParams();
    search.set("namespace", namespace);
    search.set("object", object);
    search.set("relation", relation);
    search.set("subject", subject);
    await fetch(`${config.keto.write_url}/relation-tuples?${search}`, {
      method: "DELETE",
    });
  }
}
@Service()
export abstract class BaseRBACService {
  abstract readonly namespace: string;
  abstract readonly actions: string[];
  abstract readonly rolesMapping: Record<string, string[]>;

  private readonly member = "member";

  constructor(private ketoClient: KetoClient) {}

  private createResourceGroupName(resourceId: string, role: string) {
    return `${resourceId}-${role}`;
  }

  private createRoleSubjectSet(object: string) {
    return `${this.namespace}:${object}#${this.member}`;
  }

  private insertRule(objectId: string, relation: string, subject: string) {
    console.log("INSERT", objectId, relation, subject);
    return this.ketoClient.createRelationTuple(
      this.namespace,
      objectId,
      relation,
      subject
    );
  }

  private deleteRule(objectId: string, relation: string, sub: string) {
    return this.ketoClient.deleteRelationTuple(
      this.namespace,
      objectId,
      relation,
      sub
    );
  }

  async setupRoles(resourceId: string) {
    await Promise.all(
      Object.keys(this.rolesMapping).flatMap((role) => {
        return this.rolesMapping[role].map((action) => {
          console.log(
            this.createRoleSubjectSet(
              this.createResourceGroupName(resourceId, role)
            )
          );
          return this.insertRule(
            resourceId,
            action,
            this.createRoleSubjectSet(
              this.createResourceGroupName(resourceId, role)
            )
          );
        });
      })
    );
  }

  async deleteRoles(resourceId: string) {
    await Promise.all(
      Object.keys(this.rolesMapping).flatMap((role) => {
        // TODO: delete roles binding members
        return this.rolesMapping[role].map((action) => {
          return this.deleteRule(
            resourceId,
            action,
            this.createRoleSubjectSet(
              this.createResourceGroupName(resourceId, role)
            )
          );
        });
      })
    );
  }

  async setUserRole(resourseId: string, userId: string, role: string) {
    return this.insertRule(
      this.createResourceGroupName(resourseId, role),
      this.member,
      userId
    );
  }

  async isAllowedAction(
    resourseId: string,
    action: string,
    userId: string
  ): Promise<boolean> {
    return this.ketoClient.checkRelationTuple(
      this.namespace,
      resourseId,
      action,
      userId
    );
  }
}

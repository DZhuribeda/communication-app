import {
  RegistrationFlow,
  LoginFlow,
  SettingsFlow,
  UiNode,
  UiNodeInputAttributes,
} from "@ory/kratos-client";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { FormHelperText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  csrf: {
    visibility: "hidden",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function FormInputField({
  node,
  autoComplete,
  autoFocus,
  label,
}: {
  node: UiNode;
  autoComplete?: string;
  autoFocus?: boolean;
  label?: string;
}) {
  const classes = useStyles();
  const attrs = node.attributes as UiNodeInputAttributes;
  return (
    <TextField
      variant={attrs.type === "hidden" ? "standard" : "outlined"}
      type={attrs.type}
      name={attrs.name}
      required={attrs.required}
      disabled={attrs.disabled}
      defaultValue={attrs.value}
      fullWidth
      className={attrs.type === "hidden" ? classes.csrf : null}
      id={attrs.name}
      //@ts-ignore
      label={label == null ? node.meta.label?.text : label}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      error={Boolean(node.messages)}
      helperText={node.messages?.[0].text}
    />
  );
}

function SubmitField({ node, className }: { node: UiNode; className: string }) {
  const attrs = node.attributes as UiNodeInputAttributes;
  return (
    //@ts-ignore
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      disabled={attrs.disabled}
      name={attrs.name}
      value={attrs.value}
      className={className}
    >
      {node.meta.label?.text}
    </Button>
  );
}

export function AuthForm<
  T extends RegistrationFlow | LoginFlow | SettingsFlow
>({ flow }: { flow: T }) {
  const classes = useStyles();
  const csrfTokenNode = flow.ui.nodes.find(
    (n) => (n.attributes as UiNodeInputAttributes).name === "csrf_token"
  );
  const firstNameNode = flow.ui.nodes.find(
    (n) => (n.attributes as UiNodeInputAttributes).name === "traits.name.first"
  );
  const lastNameNode = flow.ui.nodes.find(
    (n) => (n.attributes as UiNodeInputAttributes).name === "traits.name.last"
  );
  const emailNode = flow.ui.nodes.find((n) =>
    ["traits.email", "password_identifier"].includes(
      (n.attributes as UiNodeInputAttributes).name
    )
  );
  const passwordNode = flow.ui.nodes.find(
    (n) => (n.attributes as UiNodeInputAttributes).name === "password"
  );
  const submitNode = flow.ui.nodes.find(
    (n) => (n.attributes as UiNodeInputAttributes).name === "method"
  );
  return (
    <form
      action={flow.ui.action}
      method={flow.ui.method}
      className={classes.form}
      noValidate
    >
      <Grid container spacing={2}>
        <FormInputField node={csrfTokenNode} />
        {firstNameNode && (
          <Grid item xs={12} sm={6}>
            <FormInputField
              node={firstNameNode}
              autoComplete="fname"
              autoFocus
            />
          </Grid>
        )}
        {lastNameNode && (
          <Grid item xs={12} sm={6}>
            <FormInputField node={lastNameNode} autoComplete="lname" />
          </Grid>
        )}
        <Grid item xs={12}>
          <FormInputField
            node={emailNode}
            autoComplete="email"
            label="E-Mail"
          />
        </Grid>
        <Grid item xs={12}>
          <FormInputField node={passwordNode} autoComplete="current-password" />
        </Grid>
      </Grid>
      <SubmitField node={submitNode} className={classes.submit} />
      {flow.ui.messages?.map((m) => (
        <FormHelperText id="my-helper-text" error>
          {m.text}
        </FormHelperText>
      ))}
    </form>
  );
}

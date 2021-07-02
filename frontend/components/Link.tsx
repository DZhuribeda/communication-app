import React from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import MuiLink, { LinkProps as MuiLinkProps } from "@material-ui/core/Link";

const NextComposed = React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<NextLinkProps> & { className: string }
>(function NextComposed(props, ref) {
  const { as, href, ...other } = props;

  return (
    <NextLink href={href} as={as}>
      <a ref={ref} {...other} />
    </NextLink>
  );
});

type LinkProps = React.PropsWithChildren<NextLinkProps> &
  MuiLinkProps & {
    activeClassName?: string;
    className?: string;
    naked?: boolean;
    innerRef: React.ForwardedRef<HTMLAnchorElement>;
  };
// A styled version of the Next.js Link component:
function Link(props: LinkProps) {
  const {
    href,
    activeClassName = "active",
    className: classNameProps,
    innerRef,
    naked,
    ...other
  } = props;

  const router = useRouter();
  const pathname = typeof href === "string" ? href : href.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  });

  if (naked) {
    return (
      <NextComposed
        className={className}
        ref={innerRef}
        href={href}
        {...other}
      />
    );
  }

  return (
    <MuiLink
      component={NextComposed}
      className={className}
      ref={innerRef}
      //@ts-ignore
      href={href}
      {...other}
    />
  );
}

export default React.forwardRef<HTMLAnchorElement, Omit<LinkProps, "innerRef">>(
  (props, ref) => <Link {...props} innerRef={ref} />
);

import { __ } from "@erxes/ui/src/utils/core";
import React from "react";
import styled, { css } from "styled-components";
import styledTS from "styled-components-ts";
import { colors } from "@erxes/ui/src/styles";
import { darken, lighten } from "@erxes/ui/src/styles/ecolor";
import Icon from "@erxes/ui/src/components/Icon";

const types = {
  default: {
    background: colors.colorPrimary,
  },

  simple: {
    background: "rgba(0,0,0,0.05)",
    color: colors.colorCoreGray,
  },

  link: {
    background: "transparent",
    color: colors.colorPrimary,
  },
};

const sizes = {
  large: {
    padding: "10px 30px",
    fontSize: "13px",
  },
  medium: {
    padding: "7px 20px",
    fontSize: "12px",
  },
  small: {
    padding: "4px 10px",
    fontSize: "10px",
  },
};

const ButtonStyled = styledTS<{
  hugeness: string;
  btnStyle: string;
  block?: boolean;
  uppercase?: boolean;
  border?: boolean;
  round?: boolean;
  padding?: string;
  background?: boolean;
}>(styled.button)`
  border-radius: ${(props) => (props.round ? '30px' : props.block ? '8px' : '4px')};
  position: relative;
  transition: all 0.3s ease;
  outline: 0;

  ${(props) => css`
    padding: ${(props) => (!props.padding ? sizes[props.hugeness].padding : props.padding)};
    background: ${(props) => (props.background ? lighten(colors.colorPrimary, 85) : types[props.btnStyle].background)};
    font-size: ${props.uppercase
      ? sizes[props.hugeness].fontSize
      : `calc(${sizes[props.hugeness].fontSize} + 1px)`};
    text-transform: ${props.uppercase ? "uppercase" : "none"};
    color: ${types[props.btnStyle].color
      ? types[props.btnStyle].color
      : colors.colorWhite} !important;
    border: ${props.border ? '1px solid' : 'none'};
    border-color: ${props.border && colors.colorPrimary};
    display: ${props.block && "block"};
    width: ${props.block && "100%"};
    font-weight: ${!props.uppercase && "500"};

    &:hover {
      cursor: pointer;
      text-decoration: none;
      color: ${types[props.btnStyle].color &&
      darken(types[props.btnStyle].color, 35)};
      background: ${props.btnStyle !== "link" &&
      `${darken(types[props.btnStyle].background, 20)}`};
    }

    &:active,
    &:focus {
      box-shadow: ${types[props.btnStyle].border
        ? `0 0 0 0.2rem ${lighten(types[props.btnStyle].border, 65)}`
        : `0 0 0 0.2rem ${lighten(types[props.btnStyle].background, 65)}`};
      box-shadow: ${props.btnStyle === "link" && "none"};
    }

    &:disabled {
      cursor: not-allowed !important;
      opacity: 0.75;
    }
  `};

  a {
    color: ${colors.colorWhite};
  }

  & + button,
  + a,
  + span {
    margin-left: 10px;
  }

  > i + span,
  > span + i,
  > span i {
    margin-left: 5px;
  }
`;

const ButtonLink = styledTS<{ disabled?: boolean }>(
  styled(ButtonStyled.withComponent("a"))
)`
  text-decoration: inherit;
  text-align: center;

  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed !important;
      opacity: 0.75;

      &:focus {
        text-decoration: none;
      }
    `};
`;

const ButtonGroup = styledTS<{ hasGap: boolean }>(styled.div)`
  position: relative;

  button + a,
  a + button {
    margin-left: ${(props) => props.hasGap && "10px"};
  }

  ${(props) =>
    !props.hasGap &&
    css`
      button,
      a {
        margin: 0;
      }

      > button:not(:last-child),
      > a:not(:last-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: 1px solid rgba(0, 0, 0, 0.13);
      }

      > button:not(:first-child),
      > a:not(:first-child) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    `};
`;

export type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  type?: string;
  btnStyle?: string;
  size?: string;
  disabled?: boolean;
  ignoreTrans?: boolean;
  block?: boolean;
  icon?: string;
  style?: any;
  id?: string;
  uppercase?: boolean;
  target?: string;
  border?: boolean;
  round?: boolean;
  padding?: string;
  background?: boolean;
};

export default class Button extends React.Component<ButtonProps> {
  static Group = Group;

  static defaultProps = {
    btnStyle: "default",
    size: "medium",
    block: false,
    type: "button",
    uppercase: false,
    border: false,
    round: false,
    padding: '',
  };

  render() {
    const { size, ...sizeExcluded } = this.props;
    const { href, children, ignoreTrans, icon } = sizeExcluded;
    const props = { ...sizeExcluded, hugeness: size };

    // TODO: fix
    // remove any
    const Element: any = href ? ButtonLink : ButtonStyled;

    let content = children;

    if (!ignoreTrans && typeof content === "string" && __) {
      content = __(content);
    }

    if (icon) {
      return (
        <Element {...props}>
          <Icon icon={icon} />
          {content && <span>{content}</span>}
        </Element>
      );
    }

    return <Element {...props}>{content}</Element>;
  }
}

function Group({
  children,
  hasGap = true,
}: {
  children: React.ReactNode;
  hasGap?: boolean;
}) {
  return <ButtonGroup hasGap={hasGap}>{children}</ButtonGroup>;
}

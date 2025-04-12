import React from "react";
import ReactMarkdown, { type UrlTransform } from "react-markdown";
import { type PluggableList } from "unified";
import gfm from "remark-gfm";
import raw from "rehype-raw";
import { remarkAlert } from "remark-github-blockquote-alert";
import { type MarkdownPreviewProps } from "./Props";
import "./styles/markdown.css";

const defaultUrlTransform: UrlTransform = (url) => url;

export default function Preview(props: MarkdownPreviewProps) {
  const {
    prefixCls = "wmde-markdown wmde-markdown-color",
    className,
    source,
    style,
    skipHtml = true,
    onScroll,
    onMouseOver,
    pluginsFilter,
    wrapperElement = {},
    warpperElement = {},
    urlTransform,
    ...other
  } = props;
  const cls = `${prefixCls || ""} ${className || ""}`;
  const rehypePlugins: PluggableList = [...(other.rehypePlugins || [])];
  const customProps: MarkdownPreviewProps = {
    allowElement: (element, index, parent) => {
      if (other.allowElement) {
        return other.allowElement(element, index, parent);
      }
      return /^[A-Za-z0-9]+$/.test(element.tagName);
    },
  };
  if (skipHtml) {
    rehypePlugins.push(raw);
  }
  const remarkPlugins = [remarkAlert, ...(other.remarkPlugins || []), gfm];
  const wrapperProps = { ...warpperElement, ...wrapperElement };
  return (
    <>
      <div
        onScroll={onScroll}
        onMouseOver={onMouseOver}
        {...wrapperProps}
        className={cls}
        style={style}
      >
        <ReactMarkdown
          {...customProps}
          {...other}
          skipHtml={skipHtml}
          urlTransform={urlTransform || defaultUrlTransform}
          rehypePlugins={
            pluginsFilter
              ? pluginsFilter("rehype", rehypePlugins)
              : rehypePlugins
          }
          remarkPlugins={
            pluginsFilter
              ? pluginsFilter("remark", remarkPlugins)
              : remarkPlugins
          }
        >
          {source || ""}
        </ReactMarkdown>
      </div>
    </>
  );
}

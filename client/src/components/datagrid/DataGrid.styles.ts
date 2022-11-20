import { createStyles, CSSObject } from "@mantine/core"
import { PaginationMode } from "./types"

export type DataGridStylesParams = {
  height?: string | number
  width?: string | number
  noEllipsis?: boolean
  withFixedHeader?: boolean
  paginationMode?: PaginationMode
}

const ellipsis: CSSObject = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}

export default createStyles(
  (theme, { height, width, noEllipsis, withFixedHeader, paginationMode = "default" }: DataGridStylesParams) => ({
    wrapper: {
      height: height ? height + "px" : undefined,
      width: width ? width + "px" : undefined,
      backgroundColor: "transparent !important",
    },
    scrollArea: {
      position: "relative",
      paddingBottom: theme.spacing.lg,
    },
    table: {
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    thead: {
      position: "relative",
      background: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      textTransform: "uppercase",
      "::after": {
        content: "' '",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[3],
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "2px",
      },
      ...(withFixedHeader && {
        position: "sticky",
        top: 0,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        transition: "box-shadow 150ms ease",
      }),
    },
    tbody: {
      minHeight: "160px",
      background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    },
    tr: {},
    th: { position: "relative" },
    td: {},
    headerCell: {
      display: "flex",
      width: "inherit",
      height: "inherit",
      justifyContent: "space-between",
      fontSize: "12px",
    },
    headerCellContent: {
      ...(!noEllipsis && ellipsis),
    },
    headerCellButtons: {
      display: "inline-flex",
      gap: "4px",
      alignItems: "center",
    },
    dataCell: {
      display: "flex",
      width: "inherit",
      justifyContent: "space-between",
    },
    dataCellContent: {
      ...(!noEllipsis && ellipsis),
    },
    resizer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      width: 4,
      borderRight: `1px dashed ${theme.colors.dark[5]}`,
      cursor: "col-resize",
      ":hover": {
        backgroundColor: theme.colors.dark[5],
      },
    },
    sorter: {},
    filter: {},
    globalFilter: {},
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]} !important`,

      [`@media (min-width: ${theme.breakpoints.xl}px)`]: {
        justifyContent: paginationMode === "default" ? "space-between" : "flex-end",
      },
    },

    pagination_info: {
      display: "none",

      [`@media (min-width: ${theme.breakpoints.xl}px)`]: {
        display: "inline-block",
      },
    },

    pagination_size: {
      display: "none",

      [`@media (min-width: ${theme.breakpoints.xl}px)`]: {
        display: "flex",
        alignItems: "center",
        gap: `${theme.spacing.xs}px`,
      },
    },

    pagination_page: {},
  })
)

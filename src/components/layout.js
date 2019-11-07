import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Wrapper, Main } from "../components/style"
import { SEO } from "../components/seo"
import { ThemeContext } from "../components/theme"
import { Hero } from "../components/hero"
import { removeNull } from "../components/helpers"
import { NavForm } from "../components/nav"
import { ThemeForm } from "../components/theme"

import { useJsonForm } from "gatsby-tinacms-json"

const merge = require("lodash.merge")

export const Layout = ({ page, children }) => {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      nav: dataJson(fileRelativePath: { eq: "/data/menu.json" }) {
        ...nav

        rawJson
        fileRelativePath
      }
      theme: dataJson(fileRelativePath: { eq: "/data/theme.json" }) {
        ...globalTheme

        rawJson
        fileRelativePath
      }
      site: dataJson(fileRelativePath: { eq: "/data/site.json" }) {
        title
        description
        author

        rawJson
        fileRelativePath
      }
    }
  `)

  const [nav] = useJsonForm(data.nav, NavForm)
  const [globalTheme] = useJsonForm(data.theme, ThemeForm)
  const [site] = useJsonForm(data.site, SiteForm)

  const themeContext = React.useContext(ThemeContext)
  const theme = themeContext.theme
  const pageTitle = page.title
    ? page.title
    : page.frontmatter.title
    ? page.frontmatter.title
    : false
  const pageHero = page.frontmatter ? page.frontmatter.hero : page.hero
  const hero = pageHero
    ? merge({}, theme.hero, removeNull(pageHero))
    : theme.hero

  return (
    <>
      {pageTitle && <SEO title={pageTitle} />}
      <Hero hero={hero} />
      <Main>
        <Wrapper>{children}</Wrapper>
      </Main>
    </>
  )
}

const SiteForm = {
  label: "Site",
  fields: [
    {
      label: "Title",
      name: "rawJson.title",
      component: "text",
    },
    {
      label: "Description",
      name: "rawJson.description",
      component: "text",
    },
    {
      label: "Author",
      name: "rawJson.author",
      component: "text",
    },
  ],
}

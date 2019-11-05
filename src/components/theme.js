import React, { useState } from "react"
import { mix } from "polished"
import styled, { ThemeProvider } from "styled-components"
import { useStaticQuery, graphql } from "gatsby"
import { GlobalStyles, Main } from "./style"

export const ThemeContext = React.createContext()

export const Theme = ({ children }) => {
  const data = useStaticQuery(graphql`
    query ThemeQuery {
      dataJson(fileRelativePath: { eq: "/data/theme.json" }) {
        ...globalTheme
      }
    }
  `)

  const isBrowser = typeof window !== "undefined"
  const userPrefDark = isBrowser ? localStorage.getItem("isDarkMode") : false
  const initialDarkMode = userPrefDark === "true" ? true : false

  const [darkMode, setDarkMode] = useState(initialDarkMode)

  const toggleDarkMode = () => {
    const newMode = !darkMode

    setDarkMode(newMode)

    if (typeof window !== "undefined") {
      localStorage.setItem("isDarkMode", newMode)
    }
  }

  const globalTheme = data.dataJson

  const theme = {
    isDarkMode: darkMode,
    color: {
      black: darkMode ? globalTheme.color.black : globalTheme.color.black,
      white: darkMode
        ? mix(0.7, globalTheme.color.white, globalTheme.color.secondary)
        : globalTheme.color.white,
      primary: globalTheme.color.primary,
      secondary: globalTheme.color.secondary,
      foreground: darkMode
        ? mix(0.7, globalTheme.color.white, globalTheme.color.secondary)
        : globalTheme.color.black,
      background: darkMode ? globalTheme.color.black : globalTheme.color.white,
      link: globalTheme.color.primary,
    },
    easing: globalTheme.easing,
    breakpoints: globalTheme.breakpoints,
    radius: globalTheme.radius,
    header: globalTheme.header,
    menu: globalTheme.menu,
    hero: globalTheme.hero,
    typography: globalTheme.typography,
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        toggleDarkMode: toggleDarkMode,
        isDarkMode: darkMode,
      }}
    >
      <ThemeContext.Consumer>
        {({ theme }) => (
          <ThemeProvider theme={theme}>
            <>
              <GlobalStyles />
              {children}
            </>
          </ThemeProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeContext.Provider>
  )
}

export const globalThemeFragment = graphql`
  fragment globalTheme on DataJson {
    color {
      black
      white
      primary
      secondary
    }
    easing
    breakpoints {
      small
      medium
      large
      huge
    }
    radius {
      small
    }
    header {
      overline
      transparent
      height
    }
    menu {
      style
    }
    hero {
      image {
        childImageSharp {
          fluid(quality: 70, maxWidth: 1920) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
      large
      overlay
    }
    typography {
      uppercaseH2
    }
  }
`

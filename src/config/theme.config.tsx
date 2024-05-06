import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import React from 'react'

type ThemeProp = {
    children: JSX.Element;
};

export enum ThemePalette {
    BG = '#121212',
    BLUE= '#10879C',
    FONT_GLOBAL = "'JetBrains Mono', monospace ",
}
const theme = createTheme({
    palette: {
        mode : 'dark',
        background: {
            default: ThemePalette.BG,       
        },
        primary: {
            main: ThemePalette.BLUE,
        },
    },
    typography: {
        fontFamily: ThemePalette.FONT_GLOBAL,
    },
    components: {
        MuiButton: {
            defaultProps: {
                style : {
                    textTransform: 'none',
                    boxShadow: 'none',
                    borderRadius: '5px',
                }
            }
        }
    }
});
export const ThemeConfig: React.FC<ThemeProp> = ({children})=>{
    return (<ThemeProvider theme = {theme}><CssBaseline />{children}</ThemeProvider>

    );
};
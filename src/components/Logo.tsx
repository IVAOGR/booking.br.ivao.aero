import { FunctionComponent, useContext } from "react";
import { Env } from "env";
import { ThemeContext, ThemeVariants } from "context/ThemeContext";

interface LogoProps {
    sidebar?: boolean;
}

export const Logo: FunctionComponent<LogoProps> = ({ sidebar = false }) => {
    const { themeVariant } = useContext(ThemeContext);
    const imgUrl = Env[`LOGO${sidebar ? "_SIDEBAR_" : "_"}${themeVariant === ThemeVariants.DARK ? "DARK" : "LIGHT"}`];

    return (
       <img src="https://gr.ivao.aero/wp-content/uploads/2024/08/symbol-transparent-white.png" className={`w-54 ${sidebar ? "" : "-ml-5"}`} alt="Logo IVAO Brasil" />
        )

}

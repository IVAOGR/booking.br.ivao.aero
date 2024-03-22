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
        <img src="https://gr.ivao.aero/wp-content/uploads/2022/02/cropped-cropped-symbol-transparent.png" width="214px" height="56px" className={`w-54 h-14 ${sidebar ? "" : "-ml-5"}`} alt="Logo IVAO Brasil" />
    );
}

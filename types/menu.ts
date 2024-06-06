export interface Menu {
    location: "Main Menu" | "Footer Menu",
    items: MenuItem[]
}

export interface MenuItem {
    label: string;
    path: string;
    target: "_blank" | "_self";
    parent: string;
    items: MenuItem[]
}
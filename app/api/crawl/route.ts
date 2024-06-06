import { generateFunctionsPHP } from "@/functions/generate-function-php";
import { Menu, MenuItem } from "@/types/menu";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";


export async function POST(req: NextRequest) {

    const body = await req.json();
    const { url } = body as { url: string };

    if (!url) {
        return NextResponse.json({ message: "Please provide a valid url." }, { status: 400 })
    }

    // Launch the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the provided URL
    await page.goto(url);

    const menus = await page.evaluate(() => {
        const result: Menu[] = []
        const headerNav = document.querySelector('.header-nav nav > ul');
        const footerNav = document.querySelector('.footer-nav');

        function getMenuItems(element: Element): MenuItem[] {
            const items: MenuItem[] = [];
            const menuItems = element.querySelectorAll(':scope > li');
        
            menuItems.forEach((menuItem) => {
                const link = menuItem.querySelector('a');
                const label = link?.innerHTML ?? ""
                const target = (link?.target ?? "_self") as ("_blank" | "_self");
                const href = link ? (link as HTMLAnchorElement).pathname : "";
                // const href = link ? (link as HTMLAnchorElement).href : "";
                const subMenuElement = menuItem.querySelector('ul');
                const subMenu: MenuItem[] = subMenuElement ? getMenuItems(subMenuElement) : [];
        
                items.push({
                    label,
                    parent: "",
                    path: href,
                    target,
                    items: subMenu,
                });
            });
        
            return items;
        }
        
        if(headerNav){
            const headerMenu: Menu = {
                location: "Main Menu",
                items: getMenuItems(headerNav)
            }
            result.push(headerMenu)
        }

        if(footerNav){
            const footerMenu: Menu = {
                location: "Footer Menu",
                items: getMenuItems(footerNav)
            }
            result.push(footerMenu)
        }

        return result;
    })

    const scriptString = generateFunctionsPHP(menus);

    await browser.close();

    return NextResponse.json({ message: "success!", menus, scriptString })
}
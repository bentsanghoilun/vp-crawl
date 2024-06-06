import { defaultFunctionScript } from "@/data/default-functions-php";
import { Menu } from "@/types/menu";



export function generateFunctionsPHP(menus: Menu[]): string {
    const menusJson = JSON.stringify(menus, null, 2);

    const scriptString = `
<?php

${defaultFunctionScript}

function create_custom_menu(\$menu_items, \$menu_id, \$parent_id = 0) {
    foreach (\$menu_items as \$menu_item) {
        \$menu_item_id = wp_update_nav_menu_item(\$menu_id, 0, [
            'menu-item-title' => \$menu_item['label'],
            'menu-item-url' => home_url(\$menu_item['path']),
            'menu-item-target' => \$menu_item['target'],
            'menu-item-parent-id' => \$parent_id,
            'menu-item-status' => 'publish'
        ]);

        if (!empty(\$menu_item['items'])) {
            create_custom_menu(\$menu_item['items'], \$menu_id, \$menu_item_id);
        }
    }
}

function import_custom_menus() {
    \$menus = json_decode('${menusJson}', true);

    foreach (\$menus as \$menu) {
        \$menu_exists = wp_get_nav_menu_object(\$menu['location']);
        if (!\$menu_exists) {
            \$menu_id = wp_create_nav_menu(\$menu['location']);
        } else {
            \$menu_id = \$menu_exists->term_id;
        }

        create_custom_menu(\$menu['items'], \$menu_id);
    }
}

import_custom_menus()

?>
`

    return scriptString;
}
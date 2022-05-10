// If on the orbiter page, set the default for the tabs to Moonriver
if (pathname === '/node-operators/networks/collators/orbiter/') {
    tabs = document.querySelectorAll(".tabbed-set");
    tabs.forEach(tab => {
        moonbeam_tab = tab.children[0]
        moonriver_tab = tab.children[3]

        moonbeam_tab.checked = false
        moonriver_tab.checked = true
    })
}
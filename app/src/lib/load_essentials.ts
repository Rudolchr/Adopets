const m1 = document.createElement("meta");
m1.setAttribute("charset", "UTF-8");
document.head.appendChild(m1);

const m2 = document.createElement("meta");
m2.name = "viewport";
m2.content = "width=device-width, initial-scale=1";
document.head.appendChild(m2);

const m3 = document.createElement("meta");
m3.name = "theme-color";
m3.content = "#ffffff";
document.head.appendChild(m3);

const m4 = document.createElement("meta");
m4.name = "description";
m4.content = "Adopets";
document.head.appendChild(m4);

const l1 = document.createElement("link");
l1.rel = "icon";
l1.href = "/assets/favicon.svg";
document.head.appendChild(l1);

const l2 = document.createElement("link");
l2.rel = "mask-icon";
l2.href = "/assets/mask-icon.svg";
l2.setAttribute("color", "#000000");
document.head.appendChild(l2);

const l3 = document.createElement("link");
l3.rel = "apple-touch-icon";
l3.href = "/assets/apple-touch-icon.png";
document.head.appendChild(l3);

const l4 = document.createElement("link");
l4.rel = "manifest";
l4.href = "/assets/manifest.json";
document.head.appendChild(l4);

const l5 = document.createElement("link");
l5.rel = "stylesheet";
l5.href = "../css/normalize.css";
document.head.appendChild(l5);

const l6 = document.createElement("link");
l6.rel = "stylesheet";
l6.href = "../css/main.css";
document.head.appendChild(l6);

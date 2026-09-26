(function () {
  "use strict";
  var base = "https://hotelsuministros.com";
  var path = window.location.pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  var titleEl = document.querySelector("h1");
  var title = titleEl ? titleEl.textContent.trim() : document.title.replace(/\s*\|.*$/, "").trim();
  var meta = document.querySelector('meta[name="description"]');
  var description = meta ? meta.content.trim() : "";
  var isProduct = path.indexOf("/productos/") === 0 && (!!document.querySelector(".product-layout") || !!document.querySelector(".products"));
  var isBlog = path.indexOf("/blog") === 0 && !!document.querySelector("article");
  var firstImage = document.querySelector("main img:not(.logo), .products img:not(.logo), .section img:not(.logo)");
  var image = firstImage && firstImage.src ? firstImage.src : base + "/assets/images/logo-hs-unified.png";

  function addJsonLd(data) {
    var tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.text = JSON.stringify(data);
    document.head.appendChild(tag);
  }
  function labelForPage() {
    return title || "Hotel Suministros";
  }
  function addBreadcrumb() {
    if (document.querySelector(".hs-breadcrumb") || path === "/") return;
    var items = [{ name: "Inicio", url: base + "/" }];
    if (path.indexOf("/productos") === 0) items.push({ name: "Productos", url: base + "/productos.html" });
    if (path.indexOf("/blog") === 0) items.push({ name: "Blog", url: base + "/blog/" });
    items.push({ name: labelForPage(), url: base + (path === "/" ? "/" : path + (path.endsWith(".html") ? "" : "/")) });
    if (items.length < 2) return;
    var nav = document.createElement("nav");
    nav.className = "hs-breadcrumb";
    nav.setAttribute("aria-label", "Ruta de navegación");
    nav.innerHTML = items.map(function (item, index) {
      return index === items.length - 1 ? "<span aria-current=\"page\">" + item.name + "</span>" : "<a href=\"" + item.url + "\">" + item.name + "</a>";
    }).join("<span class=\"hs-breadcrumb__sep\" aria-hidden=\"true\">/</span>");
    var target = document.querySelector("main") || document.querySelector(".container");
    if (target) target.insertBefore(nav, target.firstChild);
    addJsonLd({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":items.map(function(item,index){return {"@type":"ListItem","position":index+1,"name":item.name,"item":item.url};})});
  }
  function addFaq() {
    if (document.querySelector(".hs-faq") || path === "/") return;
    var topic = labelForPage();
    var questions = isBlog ? [
      ["¿Para quién está pensada esta guía?", "Esta guía está dirigida a hoteles, alojamientos y anfitriones de Airbnb que buscan tomar mejores decisiones para la experiencia de sus huéspedes."],
      ["¿Dónde puedo solicitar ayuda sobre productos?", "Puede revisar las categorías de productos o solicitar una cotización personalizada a Hotel Suministros por WhatsApp o desde la página de contacto."]
    ] : [
      ["¿Cómo solicito una cotización de " + topic + "?", "Comparta el tipo de alojamiento, las cantidades aproximadas y la fecha en que necesita los productos. Nuestro equipo le orientará sobre las opciones disponibles."],
      ["¿Atienden hoteles y Airbnb en Costa Rica?", "Sí. Hotel Suministros atiende hoteles, hostales, alojamientos y propiedades de Airbnb en Costa Rica."],
      ["¿Pueden ayudarme a definir cantidades?", "Sí. Indique el número de habitaciones o unidades y el tipo de uso previsto para recibir una recomendación más adecuada."]
    ];
    var section = document.createElement("section");
    section.className = "hs-faq";
    section.innerHTML = "<p class=\"hs-faq__eyebrow\">PREGUNTAS FRECUENTES</p><h2>Respuestas rápidas</h2>" + questions.map(function(q){return "<details><summary>"+q[0]+"</summary><p>"+q[1]+"</p></details>";}).join("");
    var target = document.querySelector("main") || document.querySelector(".products") || document.querySelector(".section");
    if (target) target.appendChild(section);
  }
  function addStyles() {
    var css = ".hs-breadcrumb{max-width:1120px;margin:0 auto 24px;padding:0;color:#62727d;font-size:.86rem;display:flex;flex-wrap:wrap;gap:8px;align-items:center}.hs-breadcrumb a{color:#8a6015;text-decoration:none;font-weight:700}.hs-breadcrumb__sep{color:#9da8ad}.hs-faq{margin:52px auto 0;max-width:900px;padding:32px;border:1px solid #dfe6e7;border-radius:16px;background:#fff}.hs-faq__eyebrow{color:#a87415;font-size:.74rem;font-weight:800;letter-spacing:.12em;margin:0 0 5px}.hs-faq h2{font-family:Georgia,serif;color:#102c3f;margin:0 0 18px}.hs-faq details{border-top:1px solid #dfe6e7;padding:15px 0}.hs-faq details:last-child{padding-bottom:0}.hs-faq summary{cursor:pointer;color:#173e55;font-weight:800}.hs-faq details p{color:#607181;margin:10px 0 0;line-height:1.65}.container>.hs-breadcrumb{flex-basis:100%;max-width:100%;margin:0 0 6px}.products .hs-faq{margin-top:38px}@media(max-width:820px){.hs-faq{padding:24px}.hs-breadcrumb{padding:0 4px}}";
    var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);
  }
  addStyles();
  var organization = {"@context":"https://schema.org","@type":"Organization","@id":base+"/#organization","name":"Hotel Suministros","url":base+"/","logo":base+"/assets/images/logo-hs-unified.png","description":"Proveedor de amenidades, textiles y accesorios para hoteles, alojamientos y Airbnb en Costa Rica.","contactPoint":{"@type":"ContactPoint","telephone":"+50685664622","contactType":"customer service","areaServed":"CR","availableLanguage":["es"]}};
  addJsonLd(organization);
  addBreadcrumb();
  if (isProduct) addJsonLd({"@context":"https://schema.org","@type":"Product","name":title,"description":description || ("Producto para hoteles: "+title),"image":image,"brand":{"@type":"Brand","name":"Hotel Suministros"},"manufacturer":{"@id":base+"/#organization"},"url":base+path});
  if (isBlog) addJsonLd({"@context":"https://schema.org","@type":"BlogPosting","headline":title,"description":description,"image":image,"mainEntityOfPage":{"@type":"WebPage","@id":base+path},"publisher":{"@id":base+"/#organization"},"inLanguage":"es"});
  addFaq();
}());
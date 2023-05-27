function createElement(name, attrs, ...children) {
    const el = document.createElement(name);

    for (const attr in attrs) {
        if(attr.startsWith("on")) {
            el[attr] = attrs[attr];
        } else {
            el.setAttribute(attr, attrs[attr])
        }
    }

    for (const child of children) {
        if (child == null) {
            continue
        }
        el.appendChild(child)
    }

    return el
}

export function createElementNS(name, attrs, ...children) {
    var  svgns = "http://www.w3.org/2000/svg";
    var  el = document.createElementNS(svgns, name);

    for (const attr in attrs) {
        if(attr.startsWith("on")) {
            el[attr] = attrs[attr];
        } else {
            el.setAttribute(attr, attrs[attr])
        }
    }

    for (const child of children) {
        if (child == null) {
            continue
        }
        el.appendChild(child)
    }

    return el
}

export  function p(attrs, ...children) {
    return createElement("p", attrs, ...children)
}

export function span(attrs, ...children) {
    return createElement("span", attrs, ...children)
}

export function div(attrs, ...children) {
    return createElement("div", attrs, ...children)
}

export function a(attrs, ...children) {
    return createElement("a", attrs, ...children)
}

export function i(attrs, ...children) {
    return createElement("i", attrs, ...children)
}

export function form(attrs, ...children) {
    return createElement("form", attrs, ...children)
}

export function img(alt, attrs, ...children) {
    attrs['onerror'] =  (event) => event.target.remove()
    attrs['alt'] = alt
    return createElement("img", attrs, ...children)
}

export function input(attrs, ...children) {
    return createElement("input", attrs, ...children)
}

export function button(attrs, ...children) {
    return createElement("button", attrs, ...children)
}

export function path(attrs, ...children) {
    return createElementNS("path", attrs, ...children)
}

export function svg(attrs, ...children) {
    return createElementNS("svg", attrs, ...children)
}

export function body(attrs, ...children) {
    return createElement("body", attrs, ...children)
}

export function textarea(attrs, ...children) {
    return createElement("textarea", attrs, ...children)
}

export function h(level, attrs, ...children) {
    return createElement("h" + level, attrs, ...children)
}

export function parse(input) {
    const pattern = /^[ a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  
    input = input + '';

    if (!pattern.test(input)) {
      return null;
    }

    const sanitized = input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return document.createRange().createContextualFragment(sanitized);
}
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function createElement(tag, attributes = {}, innerHTML = '') {
    const element = document.createElement(tag);
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    element.innerHTML = innerHTML;
    return element;
}

function appendChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
}

function showError(message) {
    const errorDiv = createElement('div', { class: 'error' }, message);
    document.body.appendChild(errorDiv);
}

export { formatDate, createElement, appendChildren, showError };
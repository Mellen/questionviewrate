function chart(container, data)
{
    const xmlns = 'http://www.w3.org/2000/svg';
    container.innerHTML = '';
    let svg = document.createElementNS(xmlns, "svg");
    container.appendChild(svg);
}

function chart(container, data)
{
    const xmlns = 'http://www.w3.org/2000/svg';
    container.innerHTML = '';
    let svg = document.createElementNS(xmlns, 'svg');
    container.appendChild(svg);
    let viewWidth = document.body.parentElement.clientWidth;
    let viewHeight = document.body.parentElement.clientHeight;

    let chartHeight = 0;
    let chartWidth = 0;

    if(viewWidth > viewHeight)
    {
        chartWidth = viewWidth * 0.8;
        chartHeight = chartWidth;
    }
    else
    {
        chartHeight = viewHeight * 0.5;
        chartWidth = chartHeight;
    }

    svg.setAttribute('width', chartWidth);
    svg.setAttribute('height', chartHeight);

    let g = document.createElementNS(xmlns, 'g');

    svg.appendChild(g);

    let viewsLabel = document.createElementNS(xmlns, 'text');
       
    g.appendChild(viewsLabel);//append before getting size else it has no size.

    let V = document.createElementNS(xmlns, 'tspan');
    V.innerHTML = 'V';
    V.setAttribute('dy', '0');
    V.setAttribute('dx', '0');
    viewsLabel.appendChild(V);
    let VRect = V.getBBox();
    let ispan = document.createElementNS(xmlns, 'tspan');
    ispan.innerHTML = 'i';
    viewsLabel.appendChild(ispan);
    ispan.setAttribute('dy', '1em');
    ispan.setAttribute('dx', (-1*VRect.width*2/3)+'px');
    let irect = ispan.getBBox();
    let espan = document.createElementNS(xmlns, 'tspan');
    espan.innerHTML = 'e';
    viewsLabel.appendChild(espan);
    espan.setAttribute('dy', '1em');
    espan.setAttribute('dx', ((-1*VRect.width)+(irect.width))+'px');
    let wspan = document.createElementNS(xmlns, 'tspan');
    wspan.innerHTML = 'w';
    viewsLabel.appendChild(wspan);
    wspan.setAttribute('dy', '1em');
    wspan.setAttribute('dx', (-1*VRect.width)+'px');
    let sspan = document.createElementNS(xmlns, 'tspan');
    sspan.innerHTML = 's';
    viewsLabel.appendChild(sspan);
    sspan.setAttribute('dy', '1em');
    sspan.setAttribute('dx', (-1*VRect.width)+'px');
    

    let vlRect = viewsLabel.getBBox();
    viewsLabel.setAttribute('x', vlRect.width);
    viewsLabel.setAttribute('y', chartHeight/2 - vlRect.height/2);

    let tlHolder = document.createElementNS(xmlns, 'g');
    let timeLabel = document.createElementNS(xmlns, 'text');
    timeLabel.innerHTML = 'Time';

    tlHolder.appendChild(timeLabel);
    
    g.appendChild(tlHolder);

    let tlhRect = tlHolder.getBBox();
    timeLabel.setAttribute('y', chartHeight - tlhRect.height);
    timeLabel.setAttribute('x', chartWidth/2 - tlhRect.width/2);
}

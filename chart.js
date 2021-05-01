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

    let vlHolder = document.createElementNS(xmlns, 'g');
    let viewsLabel = document.createElementNS(xmlns, 'text');
    viewsLabel.setAttribute('rotate', 270);
    viewsLabel.setAttribute('letter-spacing', '4');
    viewsLabel.innerHTML = 'Views';

    vlHolder.appendChild(viewsLabel);
    vlHolder.setAttribute('transform', 'rotate(90,0,0)');
    
    g.appendChild(vlHolder);//append before getting size else it has no size.

    let vlhRect = vlHolder.getBBox();
    //because of the rotation x is vertical and y is horizontal and negative
    viewsLabel.setAttribute('y', -1*vlhRect.height);
    viewsLabel.setAttribute('x', chartHeight/2 - vlhRect.width/2);

    let tlHolder = document.createElementNS(xmlns, 'g');
    let timeLabel = document.createElementNS(xmlns, 'text');
    timeLabel.innerHTML = 'Time';

    tlHolder.appendChild(timeLabel);
    
    g.appendChild(tlHolder);

    let tlhRect = tlHolder.getBBox();
    timeLabel.setAttribute('y', chartHeight - tlhRect.height);
    timeLabel.setAttribute('x', chartWidth/2 - tlhRect.width/2);
}

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
        chartHeight = viewHeight * 0.8;
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

    let timeLabel = document.createElementNS(xmlns, 'text');
    timeLabel.innerHTML = 'Time (half days)';

    g.appendChild(timeLabel);

    let tlRect = timeLabel.getBBox();
    timeLabel.setAttribute('y', chartHeight - tlRect.height);
    timeLabel.setAttribute('x', chartWidth/2 - tlRect.width/2);

    let maxViews = data[data.length-1]['views'];
    let maxTime = parseInt(data[data.length-1]['time'],10);
    let minTime = parseInt(data[0]['time'],10);

    let halfdays = ((maxTime - minTime)/3600)/12

    let xAxisX1 = vlRect.width*6;
    let xAxisX2 = chartWidth - vlRect.width*2;
    let xAxisY1 = chartHeight - tlRect.height*4;
    let xAxisY2 = xAxisY1;

    let xAxis = document.createElementNS(xmlns, 'line');
    xAxis.setAttribute('x1', xAxisX1);
    xAxis.setAttribute('x2', xAxisX2);
    xAxis.setAttribute('y1', xAxisY1);
    xAxis.setAttribute('y2', xAxisY2);
    xAxis.setAttribute('stroke', 'black');

    g.appendChild(xAxis);

    putTicksOnXAxis(xAxisX1, xAxisX2, xAxisY1, tlRect, g, halfdays);

    let yAxisX1 = xAxisX1;
    let yAxisX2 = xAxisX1;
    let yAxisY1 = xAxisY1
    let yAxisY2 = tlRect.height;

    let yAxis = document.createElementNS(xmlns, 'line');
    yAxis.setAttribute('x1', yAxisX1);
    yAxis.setAttribute('x2', yAxisX2);
    yAxis.setAttribute('y1', yAxisY1);
    yAxis.setAttribute('y2', yAxisY2);
    yAxis.setAttribute('stroke', 'black');

    g.appendChild(yAxis);

    putTicksOnYAxis(yAxisY1, yAxisY2, yAxisX1, vlRect, g, 15, maxViews);

    plotData(xAxisX1, xAxisX2, yAxisY1, yAxisY2, data, minTime, maxTime, maxViews, g);
}

function plotData(x1, x2, y1, y2, data, minX, maxX, maxY, g)
{
    const xmlns = 'http://www.w3.org/2000/svg';
    let line = document.createElementNS(xmlns, 'polyline');
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', 2);
    let maxXValDiff = maxX - minX;
    let maxXPosDiff = x2 - x1;
    let points = data.reduce((pStr, datum) =>
                             {
                                 if(datum['time'] == minX)
                                 {
                                     pStr = `${x1},${y1} `;
                                 }
                                 else
                                 {
                                     let relXVal = (maxX - datum['time'])/maxXValDiff;
                                     let x = (x2 - x2*relXVal)+x1;

                                     let relYVal = datum['views']/maxY;
                                     let y = (y1 - y1*relYVal)+y2;

                                     pStr += `${x},${y} `;
                                 }
                                 return pStr;
                             }, '');
    line.setAttribute('points', points);
    g.appendChild(line);
}

function putTicksOnXAxis(x1, x2, y, labelRect, g, tickCount)
{
    const xmlns = 'http://www.w3.org/2000/svg';

    const gap = (x2-x1)/tickCount;

    for(let i = 0; i < tickCount; i++)
    {
        let tick = document.createElementNS(xmlns, 'line');
        let x = x1+i*gap;
        let y2 = y + labelRect.height/2;
        tick.setAttribute('x1', x+'px');
        tick.setAttribute('x2', x+'px');
        tick.setAttribute('y1', y+'px');
        tick.setAttribute('y2', y2+'px');
        tick.setAttribute('stroke', 'black');
        g.appendChild(tick);
        if(i%2 == 0)
        {
            let point = document.createElementNS(xmlns, 'text');
            point.innerHTML = i;
            point.setAttribute('y', y2+labelRect.height);
            g.appendChild(point);
            let  pbox = point.getBBox()
            point.setAttribute('x', x-pbox.width/2);
        }
    }
}

function putTicksOnYAxis(y1, y2, x, labelRect, g, tickCount, maxValue)
{
    const xmlns = 'http://www.w3.org/2000/svg';

    const gap = (y2-y1)/tickCount;
    
    for(let i = 0; i < tickCount; i++)
    {
        let tick = document.createElementNS(xmlns, 'line');
        let y = y1+i*gap;
        let x2 = x - labelRect.width/2;
        tick.setAttribute('x1', x2+'px');
        tick.setAttribute('x2', x+'px');
        tick.setAttribute('y1', y+'px');
        tick.setAttribute('y2', y+'px');
        tick.setAttribute('stroke', 'black');
        g.appendChild(tick);
        if(i%3 == 0)
        {
            let point = document.createElementNS(xmlns, 'text');
            let value = Math.floor(maxValue/tickCount*i);
            if(value > 999)
            {
                value = trancateNumber(value);
            }
            point.innerHTML = value;
            g.appendChild(point);
            let pbox = point.getBBox()
            point.setAttribute('y', y+pbox.height/2);
            let extra = pbox.width/labelRect.width+0.5;
            point.setAttribute('x', x2-labelRect.width*extra);
        }
        let point = document.createElementNS(xmlns, 'text');
        let value = maxValue;
        if(value > 999)
        {
            value = trancateNumber(value);
        }
        point.innerHTML = value;
        g.appendChild(point);
        let pbox = point.getBBox()
        let extra = pbox.width/labelRect.width+0.5;
        point.setAttribute('y', y2+pbox.height/2);
        point.setAttribute('x', x2-labelRect.width*extra);
    }
}


function trancateNumber(number)
{
    const mags = ['K', 'M', 'B', 'T'];
    let pow = Math.floor(Math.log10(number));
    let thou = Math.floor(pow/3) - 1;
    if(pow%3 == 0)
    {
        return (number / 10**pow).toFixed(1)+mags[thou];
    }
    else
    {
        return Math.floor(number / 10**pow)+mags[thou];
    }
}

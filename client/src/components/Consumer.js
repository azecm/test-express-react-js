import React from "react";


const totalAsSum = "sum";
const totalAsMax = "max";
const totalAsMin = "min";
const totalAsAvg = "avg";

const params = Array(20).fill(0).map((_, i) => 'p' + (i + 1));
const entityStateInit = Array(20).fill(0).map((_, i) => '' + (i + 1)).map(id => ({
    id,
    name: 'ent' + id,
    selected: true
}));

export function Consumer() {

    const [data, setData] = React.useState([]);
    const [totalState, setTotalState] = React.useState(totalAsSum);
    const [entityState, setEntityState] = React.useState(entityStateInit);

    const entityEnabled = new Set(entityState.filter(row => row.selected).map(row => row.id));
    const dataSelected = data.filter(row => entityEnabled.has(row.id));

    React.useEffect(() => {
        const list = entityState.filter(row => row.selected).map(row => row.id).join('-');
        const eventSource = new EventSource("/api/stream/" + list);
        eventSource.onmessage = e => updateProductList(JSON.parse(e.data));

        return () => {
            eventSource.close();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entityState]);

    const updateProductList = (items) => {
        setData([...mixData(data, items)]);
    };

    const updateEntityState = (line) => {
        line.selected = !line.selected;
        setEntityState([...entityState]);
    };

    return (
        <div>
            <h1>Consumer</h1>
            <p className="entity-select">
                {entityState.map(line =>
                    <>
                        <input type="checkbox" id={line.name} checked={line.selected}
                               onClick={() => updateEntityState(line)}/>
                        <label htmlFor={line.name}>{line.id}</label>
                    </>
                )}
            </p>
            <table>
                <tbody>
                {dataSelected.map(item =>
                    <tr key={item.id}>
                        <th>{item.id}</th>
                        {params.map(key => <td key={key} style={backgroundColor(item[key])}>{item[key]}</td>)}
                    </tr>
                )}
                </tbody>
                <tbody>
                <tr>
                    <th>ИТОГО:</th>
                    {totalView(dataSelected, totalState).map(val => <td>{val}</td>)}
                </tr>
                </tbody>
            </table>
            <p className="total-select">
                {[totalAsSum, totalAsMin, totalAsMax, totalAsAvg].map(val =>
                    <>
                        <input type="radio" id={val} name="var" checked={totalState === val}
                               onClick={() => setTotalState(val)}/>
                        <label htmlFor={val}>{val}</label>
                    </>
                )}
            </p>
        </div>);
}

function totalView(items, valTotal) {
    const data = [];
    if (items.length) {
        for (const k of params) {
            const valList = items.map(item => item[k]);
            let val = 0;
            switch (valTotal) {
                case totalAsSum:
                    val = valList.reduce((a, b) => a + b, 0);
                    break;
                case totalAsAvg:
                    val = valList.reduce((a, b) => a + b, 0) / items.length;
                    break;
                case totalAsMax:
                    val = Math.max.apply(null, valList);
                    break;
                case totalAsMin:
                    val = Math.min.apply(null, valList);
                    break;
                default:
                    break;
            }
            data.push(Math.round(val * 10000) / 10000);
        }
    }
    return data;
}

function backgroundColor(val) {
    let backgroundColor = 'rgb(255, 255, 255)';
    let color = 'rgb(0, 0, 0)';
    if (val > 0) {
        backgroundColor = `rgba(0, 0, 0, ${val})`;
        if (val > 0.5) {
            color = `rgb(240, 240, 240)`;
        }
    } else if (val < 0) {
        backgroundColor = `rgba(255, 140, 0, ${-val})`;
    }
    return {backgroundColor, color};
}

function mixData(prev, next) {
    next = JSON.parse(JSON.stringify(next));

    let reorder = false;
    while (next.length) {
        const itemNext = next.shift();
        if (!itemNext) continue;

        const ind = prev.findIndex(itemPrev => itemPrev.id === itemNext.id);
        if (ind > -1) {
            prev[ind] = itemNext;
        } else {
            prev.push(itemNext);
            reorder = true;
        }
    }

    if (reorder) {
        sortData(prev);
    }

    return prev;
}

function getInt(val) {
    return parseInt(val.replace(/\D/g, ''), 10);
}

function sortData(items) {
    items.sort((a, b) => getInt(a.id) - getInt(b.id));
}


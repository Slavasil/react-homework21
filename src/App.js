import React from 'react';

function YearTable(props) {
    console.log('YearTable', props);

    return (
        <div>
            <h2>Year Table</h2>
            <table>
                <tr>
                    <th>Year</th>
                    <th>Amount</th>
                </tr>
                {props.list.map(item => (
                    <tr>
                        <td>{item.year}</td>
                        <td>{item.amount}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

function SortTable(props) {
    console.log('SortTable', props);

    return (
        <div>
            <h2>Sort Table</h2>
            <table>
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                </tr>
                {props.list.map(item => (
                    <tr>
                        <td>{item.date}</td>
                        <td>{item.amount}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

function MonthTable(props) {
    console.log('MonthTable', props);

    return (
        <div>
            <h2>Month Table</h2>
            <table>
                <tr>
                    <th>Month</th>
                    <th>Amount</th>
                </tr>
                {props.list.map(item => (
                    <tr>
                        <td>{item.month}</td>
                        <td>{item.amount}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

// TODO:
// 1. Загрузите данные с помощью fetch: https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hoc/aggregation/data/data.json
// 2. Не забудьте вынести URL в переменные окружения (не хардкодьте их здесь)
// 3. Положите их в state
export default class App extends React.Component {
    state = {
        list: [],
        year: '2018'
    };

    componentDidMount() {
      fetch('https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hoc/aggregation/data/data.json').then(
        async (response) => {
          console.log(response);
          if (response.ok) {
            this.setState({list: (await response.json()).list}); 
          }
        },
        (error) => {
          console.log(error);
          this.setState({list: []});
        }
      );
    }

    render() {
        const list = this.state.list;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let year = this.state.year;
        console.log(year)
        if (year == null) {
          year = new Date().getFullYear();
        }
        list.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        let monthTableList = [];
        let monthTableLen = 0;
        for (let i = 0; i < list.length; ++i) {
          let entry = list[i];
          let dateSplitted = entry.date.split('-', 3);
          if (parseInt(dateSplitted[0]) != year) continue;
          let month = parseInt(dateSplitted[1]);
          let monthName = monthNames[month-1];
          if (monthTableLen > 0 && monthTableList[monthTableLen-1].month == monthName) {
            monthTableList[monthTableLen-1].amount += entry.amount;
          } else {
            monthTableList.push({month: monthName, amount: entry.amount});
            ++monthTableLen;
          }
        }

        let yearTableList = [];
        let yearTableLen = 0;
        for (let i = 0; i < list.length; ++i) {
          let entry = list[i];
          let dateSplitted = entry.date.split('-', 3);
          let year = parseInt(dateSplitted[0]);
          if (yearTableLen > 0 && yearTableList[yearTableLen-1].year == year) {
            yearTableList[yearTableLen-1].amount += entry.amount;
          } else {
            yearTableList.push({year: year, amount: entry.amount});
            ++yearTableLen;
          }
        }

        function onYearInput(e) {
          this.setState({year: parseInt(e.target.value)})
        }
        return (
          <>
            <input type="number" onInput={onYearInput.bind(this)} defaultValue="2018" maxLength="4" min="1970" max={new Date().getFullYear()}/>
            <div id="app">
                <MonthTable list={monthTableList} />
                <YearTable list={yearTableList} />
                <SortTable list={list} />
            </div>
          </>
        );
    }
}
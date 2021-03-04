import './App.css';
import {FormControl, Select, MenuItem, Card, CardContent} from "@material-ui/core";
import {useEffect, useState} from "react";
import InfoBox from './InfoBox';
import Map from "./Map";
import Table from "./Table";
import {sortData} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {

    const[countries, setCountries] = useState([ ]);
    const[country, setCountry] = useState('worldwide');
    const[countryInfo, setCountryInfo] = useState({});
    const[tableData, setTableData] = useState([]);
    const[mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
    const[mapZoom, setMapZoom] = useState(3);
    const[mapCountries, setMapCountries] = useState([]);

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
            .then(response => response.json())
            .then(data => {
                setCountryInfo(data);
            })
    }, []);

    useEffect(() => {
        const getCountriesData = async () => {
            await fetch('https://disease.sh/v3/covid-19/countries')
                .then(response => response.json())
                .then(data => {
                    const countries = data.map((country) => (
                        {
                            name: country.country,
                            value: country.countryInfo.iso2
                        }
                    ));
                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setMapCountries(data);
                    setCountries(countries);
                })
        }
        getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        setCountry(countryCode);
        const url = countryCode === 'worldwide' ?
            'https://disease.sh/v3/covid-19/all' :
            `https://disease.sh/v3/covid-19/countries/${countryCode}`
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCountry(countryCode);
                setCountryInfo(data);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            })
    }

    return (
    <div className="App">
        <div className="app-left">
            <div className="app-header">
              <h1>Covid-19 tracker</h1>
              <FormControl className="app-dropdown">
                   <Select variant="outlined" value={country} onChange={onCountryChange}>
                       <MenuItem value='worldwide'>Worldwide</MenuItem>
                       {
                           countries.map(country => (
                               <MenuItem value={country.value}>{country.name}</MenuItem>
                           ))
                       }
                   </Select>
              </FormControl>
            </div>
            <div className="app-stats">
                <InfoBox title="Coronavirus cases" total={countryInfo.cases} cases={countryInfo.todayCases} />
                <InfoBox title="Recovered" total={countryInfo.recovered} cases={countryInfo.todayRecovered} />
                <InfoBox title="Deaths" total={countryInfo.deaths} cases={countryInfo.todayDeaths}/>
            </div>
            <Map center={mapCenter} zoom={mapZoom} countries={mapCountries}/>
        </div>
        <Card className="app-right">
            <CardContent>
                <h3>Live cases by country</h3>
                    <Table countries={tableData} />
                <h3>Worldwide new cases</h3>
                    <LineGraph />
            </CardContent>
        </Card>
    </div>
    );
}

export default App;

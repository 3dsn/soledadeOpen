import React from "react";
import { useState } from 'react';
import Select from 'react-select';

import { Chart as ChartJS, defaults, elements } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "./App.css";
import dataSource from "./tce/despesa_jq.json"

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const dados = dataSource.despesa

export const App = () => {

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: 11,
      color: 'blue',
      backgroundColor: state.isSelected ? 'lightblue' : 'white', // Change background color for selected options
    }),
  };

  const setores = [...new Set(dados.map((data) => data.dsc_funcao))];

  let options = []
  setores.forEach(function (e) {
    options.push({ label: e.slice(5), value: e })
  })

  const [selectedOption, setSelectedOption] = useState({ label: 'ADMINISTRAÇÃO', value: '04 - ADMINISTRAÇÃO' });

  let filtroSetor = selectedOption.value

  const setor = dados.filter(element => element.dsc_funcao === filtroSetor)
  const mesesDoAno = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
  const mesesPago = []
  const mesesEmpenho = []
  let newIndex = 0
  function totalMes(item, indice) {
    mesesEmpenho[newIndex] = setor
      .filter(({ num_mesexercicio }) => num_mesexercicio === indice + 1)
      .reduce((acumulador, { vlr_empenhado }) => acumulador + vlr_empenhado, 0).toFixed(2)
    mesesPago[newIndex] = setor
      .filter(({ num_mesexercicio }) => num_mesexercicio === indice + 1)
      .reduce((acumulador, { vlr_pago }) => acumulador + vlr_pago, 0).toFixed(2)
    newIndex++
  }
  mesesDoAno.forEach(totalMes)
  let ano = setor[0].num_anoexercicio

  return (
    <div className="App">
      <div className="dataCard lineChartCardCard">
        <Line
          data={{
            labels: mesesDoAno.map((data) => data),
            datasets: [
              {
                label: "Vlr Empenhado",
                data: mesesEmpenho.map((data) => data),
              },
              {
                label: "Vlr Pago",
                data: mesesPago.map((data) => data),
              },
            ],
          }}
          options={{
            elements: {
              line: {
                tension: 0.5,
              },
            },
            plugins: {
              title: {
                text: ano + " Despesas de Soledade no Setor: " + filtroSetor,
              },
            },
          }}
        />
      </div>

      <div className="dataCard comboCard">
        <Select
          defaultValue={{ label: 'ADMINISTRAÇÃO', value: '04 - ADMINISTRAÇÃO' }}
          onChange={setSelectedOption}
          options={options}
          styles={customStyles}
          isSearchable={false}
        />
        <div className="tab">

          <h5>Fonte TCE:</h5>
          <a href="https://dadosabertos.tce.mg.gov.br/" target="_blank">dadosabertos MG</a>
        </div>

      </div>

      <div className="dataCard barChartCard">
        <Bar
          data={{
            labels: mesesDoAno.map((data) => data),
            datasets: [
              {
                label: "Valor Pago",
                data: mesesPago.map((data) => data),
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Despesas",
              },
            },
          }}
        />
      </div>


    </div>
  );
};

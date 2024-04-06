const apiURL = "https://mindicador.cl/api/"

const monedaDestino = document.querySelector("#moneda-destino")
const resultado = document.querySelector(".resultado")
const montoPesos = document.querySelector(".monto-pesos")


async function getMonedas() {
    try {
        const res = await fetch(apiURL+monedaDestino.value)
        const monedas = await res.json()
        return monedas.serie
    } catch (e) {
        resultado.innerHTML = "Error: " + e.message
    }
}


function prepararConfiguracionParaLaGrafica(monedas) {
    monedas = monedas.slice(0, 10)
    monedas.sort((p1, p2) => {
        if (p1.fecha < p2.fecha) return -1
        if (p1.fecha > p2.fecha) return 1
        return 0
    })
  
    const tipoDeGrafica = "line"
    const fechas = monedas.map((moneda) => {
        const fechaCorta = moneda.fecha.substr(0,10)
        return fechaCorta
    })
    const titulo = "Valor diario"
    const colorDeLinea = "red"
    const valores = monedas.map((moneda) => moneda.valor)

    const config = {
        type: tipoDeGrafica,
        data : {
            labels: fechas,
            datasets: [
                {
                    label: titulo,
                    backgroundColor: colorDeLinea,
                    borderColor: colorDeLinea,
                    data: valores
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Historial últimos 10 días'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Tipo de cambio [CLP]'
                    }
                }
            }
        }
    }
    return config
}

let myChart

async function calculaTC() {
    const monto = Number(montoPesos.value) | 0
    if (monto != 0 ) {
        if (monedaDestino.value != "") {
            const monedas = await getMonedas()
            const tc = monedas[0].valor
            resultado.innerHTML = "Resultado: $" + (new Intl.NumberFormat("es-CL").format(monto * tc))
            const config = prepararConfiguracionParaLaGrafica(monedas)
            const chartDOM = document.getElementById("myChart")
            chartDOM.style.backgroundColor = "white"
            if (myChart) {
                myChart.destroy()
            }
            myChart = new Chart(chartDOM, config)
        } else {
            alert("!Debe seleccionar una moneda!")
        }
    } else {
        alert("!Debe ingresar un monto mayor que 0!")
    }
}
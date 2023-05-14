console.log("🟢 Connected!");

const formPresupuesto = document.querySelector("#presupuesto");
const formGastos = document.querySelector("#gastos");
const tablaGastos = document.querySelector("#tablaGastos");

//DISPLAYS
const displayPresupuesto = document.querySelector("#displayPresupuesto");
const displaySaldo = document.querySelector("#displaySaldo");
const displayGastos = document.querySelector("#displayGastos");

//CONTADOR PARA IDS
let uid = 1;

const presupuesto = {
  total: "",
  gastos: [],
  totalgastos: function () {
    const total = this.gastos.reduce((a, b) => a + b.monto, 0);

    return total;
  },
  saldo: function () {
    return this.total - this.totalgastos();
  },
};

//FORMATEAR DIVISAS A CLP
const formatearDivisa = (monto) => {
  let CLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  });

  return CLP.format(monto);
};

//RENDERIZA LOS GASTOS Y ACUALIZA DISPLAYS
const renderizarGastos = () => {
  let html = "";

  for (const gasto of presupuesto.gastos) {
    html += `<tr>
    <td>${gasto.descripcion}</td>
    <td>${formatearDivisa(gasto.monto)}</td>
    <td>
      <button type="button" class="btn deleteBtn" aria-label="eliminar gasto" data-gasto="${
        gasto.id
      }">
        <i
          class="fa-solid fa-trash text-primary pe-none"
          aria-hidden="true"
        ></i>
      </button>
    </td>
  </tr>`;
  }

  document.querySelector("tbody").innerHTML = html;
  displaySaldo.textContent = formatearDivisa(presupuesto.saldo());
  displayGastos.textContent = formatearDivisa(presupuesto.totalgastos());
};

//ELIMINA EL GASTO SELECCIONADO
const eliminarGasto = (id) => {
  const index = presupuesto.gastos.findIndex((gasto) => gasto.id == id);

  presupuesto.gastos.splice(index, 1);
  renderizarGastos();
};

//AGREGA NUEVO PRESUPUESTO
formPresupuesto.addEventListener("submit", function (e) {
  e.preventDefault();

  const input = document.querySelector("#inputPresupuesto");

  if (input.value > 0) {
    presupuesto.total = Number(input.value);

    displayPresupuesto.textContent = `${formatearDivisa(presupuesto.total)}`;
  } else {
    alert("Debes ingresar un número positivo mayor a cero");
    input.focus();
  }
});

//AGREGA NUEVOS GASTOS
formGastos.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = new FormData(formGastos);
  const dataObjeto = Object.fromEntries(data);

  //VALIDACIÓN DE CONTENIDO
  if (presupuesto.total <= 0) {
    alert("No has ingresado un presupuesto");
    document.querySelector("#inputPresupuesto").focus();
    return;
  }

  if (presupuesto.saldo() < Number(dataObjeto.cantidadGasto)) {
    alert("No tienes más saldo disponible");
    return;
  }

  if (!dataObjeto.nombreGasto.trim()) {
    alert("Debes agregar la descripción del gasto");
    nombreGasto.focus();
    return;
  }

  const nuevoGasto = {
    id: uid,
    descripcion: dataObjeto.nombreGasto,
    monto: Number((dataObjeto.cantidadGasto ||= 0)),
  };

  uid++;

  presupuesto.gastos.push(nuevoGasto);
  renderizarGastos();
});

//DELEGACIÓN DE EVENTOS BOTONES PARA ELIMINAR
tablaGastos.addEventListener("click", (e) => {
  if (e.target.matches(".deleteBtn")) {
    eliminarGasto(e.target.dataset.gasto);
  }
});

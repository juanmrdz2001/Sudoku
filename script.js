"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const btnResolver = document.getElementById("btnResolver");
  btnResolver.addEventListener("click", resolverJuego);

  const btnReiniciar = document.getElementById("btnReiniciar");
  btnReiniciar.addEventListener("click", reiniciarSodoku);

  const tablaSodoku = document.getElementById("tabla-sodoku");
  const medidaCuadricula = 9;

  for (let fila = 0; fila < medidaCuadricula; fila++) {
    const nuevaFila = document.createElement("tr");
    for (let col = 0; col < medidaCuadricula; col++) {
      const celda = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.className = "celda";
      input.id = `celda-${fila}-${col}`;

      celda.appendChild(input);
      nuevaFila.appendChild(celda);

      //Validar en tiempo real
      input.addEventListener("input", function (event) {
        validarEntrada(event, fila, col);
      });
      //Fin validar
    }
    tablaSodoku.appendChild(nuevaFila);
  }
});

//Funcion para reiniciar el juego
function reiniciarSodoku() {
  for (let fila = 0; fila < medidaCuadricula; fila++) {
    for (let col = 0; col < medidaCuadricula; col++) {
      const celdaId = `celda-${fila}-${col}`;
      const celda = document.getElementById(celdaId);
      celda.value = "";
      celda.classList.remove("resolverEfecto", "entradaUsuario");
    }
  }
}

async function resolverJuego() {
  const medidaCuadricula = 9;
  const listaSodoku = [];

  //llenamos con valores el tablero
  for (let fila = 0; fila < medidaCuadricula; fila++) {
    listaSodoku[fila] = [];
    for (let col = 0; col < medidaCuadricula; col++) {
      const celdaId = `celda-${fila}-${col}`;
      const celdaValor = document.getElementById(celdaId).value;
      listaSodoku[fila][col] = celdaValor !== "" ? parseInt(celdaValor) : 0;
    }
  }

  //Identificamos las celdas que ingresa el usuario y las marcamos
  for (let fila = 0; fila < medidaCuadricula; fila++) {
    for (let col = 0; col < medidaCuadricula; col++) {
      const celdaId = `celda-${fila}-${col}`;
      const celda = document.getElementById(celdaId);

      if (listaSodoku[fila][col] !== 0) {
        celda.classList.add("entradaUsuario");
      }
    }
  }

  //Una vez resuelto el juego,mostramos la solucion en el tablero
  if (maestroSodoku(listaSodoku)) {
    for (let fila = 0; fila < medidaCuadricula; fila++) {
      for (let col = 0; col < medidaCuadricula; col++) {
        const celdaId = `celda-${fila}-${col}`;
        const celda = document.getElementById(celdaId);

        if (!celda.classList.contains("entradaUsuario")) {
          celda.value = listaSodoku[fila][col];
          celda.classList.add("resolverEfecto");
          await efectoRetraso(20);
        }
      }
    }
  } else {
    alert("No tiene solucion el juego");
  }
}

//Funcion Maestro Sodoku - Solucionador
function maestroSodoku(tablero) {
  const medidaCuadricula = 9;

  for (let fila = 0; fila < medidaCuadricula; fila++) {
    for (let col = 0; col < medidaCuadricula; col++) {
      if (tablero[fila][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (verificaConfictos(tablero, fila, col, num)) {
            tablero[fila][col] = num;

            //Intentamos resolverlo con
            if (maestroSodoku(tablero)) {
              return true;
            }
            tablero[fila][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

//Funcion para verificar conflictos y evitar errores en la solucion
function verificaConfictos(tablero, fila, col, num) {
  const medidaCuadricula = 9;

  //Verificamos la fila y la columna
  for (let i = 0; i < medidaCuadricula; i++) {
    if (tablero[fila][i] === num || tablero[i][col] === num) {
      return false;
    }
  }

  //verificamos la subcuadricula 3x3
  const filaInicio = Math.floor(fila / 3) * 3;
  const colInicio = Math.floor(col / 3) * 3;

  for (let i = filaInicio; i < filaInicio + 3; i++) {
    for (let j = colInicio; j < colInicio + 3; j++) {
      if (tablero[i][j] === num) {
        return false;
      }
    }
  }
  return true;
}

// Funcion para efecto al llenar el tablero
function efectoRetraso(ms) {
  return new Promise((resikver) => setTimeout(resolver, ms));
  //return new Promise((maestroSodoku) => setTimeout(maestroSodoku, ms));
}

//Funcion para validar la entrada
function validarEntrada(event, fila, col) {
  const celdaId = `celda-${fila}-${col}`;
  const celda = document.getElementById(celdaId);
  const valor = celda.value;

  // Validar solo numero del 1-9
  if (!/^[1-9]$/.test(valor)) {
    Swal.fire({
      icon: "warning",
      title: `El numero ${valor} no es valido, ingrese un valor del (1-9)`,
      showConfirmButton: false,
      timer: 2500,
    });
    celda.value = "";
    return;
  }
}

//Verificar si el numero existe en la fila o columna
const numeroIngresado = parseInt(valor);

for (let i = 0; i < 9; i++) {
  if (
    i !== col &&
    document.getElementById(`celda-${fila}-${i}`).value == numeroIngresado
  ) {
    Swal.fire({
      icon: "warning",
      title: `El numero ${numeroIngresado} no es valido, ya existe en la fila`,
      showConfirmButton: false,
      timer: 2500,
    });
    celda.value = "";
    //return;
  }

  if (
    i !== fila &&
    document.getElementById(`celda-${i}-${col}`).value == numeroIngresado
  ) {
    Swal.fire({
      icon: "warning",
      title: `El numero ${numeroIngresado} no es valido, ya existe en la Columna`,
      showConfirmButton: false,
      timer: 2500,
    });
    celda.value = "";
    //return;
  }

  //Verificar en la subcuadricula 3x3
  const subcuadriculaFilaInicio = Math.floor(fila / 3) * 3;
  const subcuadriculaColInicio = Math.floor(col / 3) * 3;

  for (let i = subcuadriculaFilaInicio; i < subcuadriculaFilaInicio + 3; i++) {
    for (
      let j = subcuadriculaColInicio;
      (j = subcuadriculaColInicio + 3);
      j++
    ) {
      if (
        (i !== fila) & (j !== col) &&
        document.getElementById(`celda-${i}-${j}`).value == numeroIngresado
      ) {
        Swal.fire({
          icon: "warning",
          title: `El numero ${numeroIngresado} no es valido, ya existe en el Recuadro`,
          showConfirmButton: false,
          timer: 2500,
        });
        celda.value = "";
        //return;
      }
    }
  }
}

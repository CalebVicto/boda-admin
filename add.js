const inv = document.getElementById('inv')
const add = document.getElementById('add')
const add_bnt = document.getElementById('add_btn')
const nom = document.getElementById('nombre')
const cod_uniq = document.getElementById('cod_uniq')
const tipo_1 = document.getElementById('tipo_1')
const tipo_2 = document.getElementById('tipo_2')
const tipo_3 = document.getElementById('tipo_3')
const list_inv = document.getElementById('invitados')
const loading = document.querySelector('.loading')

const setL = (val = true) => {
  val
    ? loading.style.display = 'flex'
    : loading.style.display = 'none'
}

const obtenerTipo = () => {
  if (tipo_1.checked == true) return 1
  if (tipo_2.checked == true) return 2
  if (tipo_3.checked == true) return 3
}

const validar = () => {
  if (!tipo_1.checked && !tipo_2.checked && !tipo_3.checked) {
    alert('Llenar los Campos!')
    return false
  }
  if (nom.value === '') {
    alert('Llenar los Campos!')
    return false
  }
  return true
}

const limpiar = () => {
  tipo_1.checked = false
  tipo_2.checked = false
  tipo_3.checked = false
  nom.value = ''
}

add.onclick = async () => {
  if (!validar()) return false

  if (localStorage.invitados != undefined) {
    if (localStorage.invitados != '') {
      invitados = JSON.parse(localStorage.invitados)
    } else {
      invitados = []
    }
  } else {
    invitados = []
  }

  let tipo = obtenerTipo()
  let nombre = nom.value

  invitados.push({
    nombre,
    tipo,
    estado: 1
  })

  localStorage.invitados = JSON.stringify(invitados)
  llenarInvitaciones()
  limpiar()
}

const eliminar = (index) => {
  invitados = JSON.parse(localStorage.invitados)
  invitados.splice(index, 1)
  localStorage.invitados = JSON.stringify(invitados)
  llenarInvitaciones()
}


const llenarInvitaciones = async () => {
  // let invitados = []

  if (localStorage.invitados) {
    invitados = JSON.parse(localStorage.invitados)
    if (invitados.length == 0) {
      list_inv.innerHTML = `
      <div class="inv">
        LISTA VACIA
      </div>
    `
      return 0
    }
  } else {
    list_inv.innerHTML = `
      <div class="inv">
        LISTA VACIA
      </div>
    `
    return 0
  }

  let _invs = ''

  await Promise.all(invitados.map((e, index) => {
    let _inv = `
    <div class="inv">
      <h1>${e.nombre}</h1>
      <span>Asistencia:
      ${e.tipo == 3
        ? '<b>Presencial/Virtual</b>'
        : (
          e.tipo == 2
            ? '<b>Solo Virtual</b>'
            : (
              e.tipo == 1
                ? '<b>Solo Presencial</b>'
                : ''
            )
        )
      }
      </span> <br> <br>
      <a onclick="eliminar('${index}')">eliminar</a>
    </div>
    `
    _invs += _inv
  }))

  list_inv.innerHTML = _invs

}


llenarInvitaciones()


add_bnt.onclick = async () => {

  if (localStorage.invitados === undefined) return alert('Llenar Campos!')
  let invitados = JSON.parse(localStorage.invitados)
  if (invitados.length == 0) return alert('Llenar Campos!')
  if (cod_uniq.value == '') return alert('Llenar Campos!')
  const _data = { cod_uniq: cod_uniq.value, invitados }
  setL()
  const data = await axios.post('https://fierce-taiga-34211.herokuapp.com/admin', _data)
  if (data.data.message) {
    setL(false)
    alert(data.data.message)
  } else {
    setL(false)
    alert('Invitación Creada!')
    localStorage.invitados = ''
    window.location.reload()
  }
}
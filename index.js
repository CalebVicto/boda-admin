const list_inv = document.getElementById('list-inv')

const llenarEntrada = async (data = []) => {
  if (data.length === 0) {
    list_inv.innerHTML = `<div class="no-entradas">NO EXISTEN INVITACIONES REGISTRADAS</div>`
    return 0
  }

  let invitaciones = ''

  await Promise.all(
    data.map(async i => {
      let parte_1 = `
    <div class="invitacion">
      <div class="cod">${i.cod_uniq}</div>
      <div class="list-invitados">
        <div class="invitados">`

      let invitados = ''
      if (i.invitados.length !== 0) {
        const inv = i.invitados
        await Promise.all(
          inv.map(e => {
            let invitado = `
        <div class="invitado">
          <h2 class="nombre">${e.nombre}</h2>
          <span>Opciones de asistencia:</span>
          <div class="opciones">
          ${e.tipo == 3
                ? 'Presencial/Virtual'
                : (
                  e.tipo == 2
                    ? 'Solo Virtual'
                    : (
                      e.tipo == 1
                        ? 'Solo Presencial'
                        : ''
                    )
                )
              }
        </div>
        <br>
        <span>Estado:</span>
          <div class="estado">
            ${e.estado == 4
                ? 'No Asiste'
                : (
                  e.tipo == 3
                    ? 'Asiste Virtual'
                    : (
                      e.tipo == 2
                        ? 'Asiste Presencial'
                        : (
                          e.tipo == 1
                            ? 'Por confirmar'
                            : ''
                        )
                    )
                )
              }
          </div>
        </div>
        `
            invitados += invitado
          })
        )
      }



      let parte_3 = `
        </div>
      </div>
      <a href="#" class="enlace">editar</a>
    </div>
    `
      invitaciones += parte_1 + invitados + parte_3
    }))

  list_inv.innerHTML = invitaciones

}

window.onload = async () => {
  const data = await fetch('https://fierce-taiga-34211.herokuapp.com/admin').then(res => res.json())
  llenarEntrada(data)
}
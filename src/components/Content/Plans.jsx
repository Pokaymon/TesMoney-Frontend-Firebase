import './Css/Plans.css';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

const plans = [
  {
    nombre: 'Plan Básico',
    descripcion: 'Ideal para usuarios nuevos o con necesidades simples.',
    beneficios: [
      '✅ Hasta 1 billetera activa',
      '✅ Hasta 30 movimientos al mes',
      '❌ No permite compartir billetera',
      '❌ Sin exportación de datos'
    ],
    valor: 'BASICO'
  },
  {
    nombre: 'Plan Estándar',
    descripcion: 'Perfecto para usuarios frecuentes con control financiero personal.',
    beneficios: [
      '✅ Hasta 3 billeteras activas',
      '✅ Hasta 100 movimientos al mes',
      '❌ No permite compartir billetera',
      '❌ Sin exportación de datos'
    ],
    valor: 'ESTANDAR'
  },
  {
    nombre: 'Plan Familiar',
    descripcion: 'Diseñado para grupos o familias que comparten finanzas.',
    beneficios: [
      '✅ Hasta 5 billeteras activas',
      '✅ Hasta 300 movimientos al mes',
      '✅ Compartir billetera con hasta 4 usuarios',
      '❌ Sin exportación de datos'
    ],
    valor: 'FAMILIAR'
  },
  {
    nombre: 'Plan Profesional',
    descripcion: 'Para usuarios intensivos, trabajadores freelance',
    beneficios: [
      '✅ Hasta 10 billeteras activas',
      '✅ Compartir billetera con hasta 10 usuarios',
      '✅ Exportación a Excel/PDF',
      '✅ Soporte prioritario'
    ],
    valor: 'PROFESIONAL'
  },
  {
    nombre: 'Plan Empresarial',
    descripcion: 'Para empresas y organizaciones.',
    beneficios: [
      '✅ Billeteras ilimitadas',
      '✅ Usuarios ilimitados por billetera',
      '✅ Roles y permisos',
      '✅ Exportación masiva de datos',
      '✅ Soporte premium 24/7'
    ],
    valor: 'EMPRESARIAL'
  }
];

function Plans() {
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);
  const [userPlanValor, setUserPlanValor] = useState(null); // valor del plan del usuario

  // Decodificar JWT para extraer el ID (solo una vez)
  function decodeToken(token) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Token inválido');
      return null;
    }
  }

  // Al montar el componente, obtenemos el id y el plan del usuario del backend
  useEffect(() => {
    if (!token) return;

    const decoded = decodeToken(token);
    if (!decoded?.id) return;

    setUserId(decoded.id);

    fetch(`https://tesmoney.ddnsfree.com/api/users/${decoded.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Error al obtener usuario');
        }
        return res.json();
      })
      .then((data) => {
        // Suponiendo que el plan viene en data.plan
        setUserPlanValor(data.plan);
      })
      .catch((err) => {
        Swal.fire('Error', err.message, 'error');
      });
  }, [token]);

  // Obtener el objeto plan completo a partir del valor userPlanValor para mostrar el nombre correcto
  const userPlanObj = plans.find(p => p.valor.toUpperCase() === (userPlanValor || '').toUpperCase());

  const handlePlanClick = (plan) => {
    if (!token || !userId) {
      Swal.fire('Error', 'No se encontró una sesión activa. Por favor inicia sesión.', 'error');
      return;
    }

    Swal.fire({
      title: `¿Seleccionar ${plan.nombre}?`,
      text: 'Esta acción cambiará tu plan actual.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FF6A00',
      cancelButtonColor: '#333333',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://tesmoney.ddnsfree.com/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ plan: plan.valor })
        })
          .then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || 'Error en la actualización');
            }
            return res.json();
          })
          .then(() => {
            Swal.fire('¡Plan actualizado!', `Has cambiado al plan ${plan.nombre}.`, 'success');
            setUserPlanValor(plan.valor); // actualizar el plan localmente
          })
          .catch((err) => {
            Swal.fire('Error', err.message, 'error');
          });
      }
    });
  };

  return (
    <section className="PlansSection">
      <h2 className="PlansTitle">
        {userPlanObj ? userPlanObj.nombre : 'No tienes un plan asignado'}
      </h2>
      <div className="PlansContainer">
        {plans.map((plan, idx) => (
          <div key={idx} className="PlanCard" onClick={() => handlePlanClick(plan)}>
            <h3 className="PlanName">{plan.nombre}</h3>
            <p className="PlanDesc">{plan.descripcion}</p>
            <ul className="PlanList">
              {plan.beneficios.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Plans;

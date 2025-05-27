import './Css/PocketContent.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PocketContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const pocket = location.state?.pocket;

    const [currentPocket, setCurrentPocket] = useState(pocket);
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const [transactions, setTransactions] = useState([]);

    if (!pocket) {
        navigate('/home');
        return null;
    }

    const token = localStorage.getItem('token');

    const fetchPocketData = async () => {
        try {
            console.log('ID del pocket:', pocket.id);
            const res = await fetch(`https://tesmoney.ddnsfree.com/pocket/${pocket.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setCurrentPocket(data);
            } else {
                console.error('Error al obtener bolsillo actualizado');
            }
        } catch (error) {
            console.error('Error al actualizar pocket:', error);
        }
    };

    const handleSubmit = async (type) => {
        try {
            const res = await fetch('https://tesmoney.ddnsfree.com/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type,
                    description,
                    amount: parseFloat(amount),
                    pocket_id: pocket.id
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert(`${type === 'income' ? 'Ingreso' : 'Gasto'} registrado correctamente`);
                resetForm();
                await fetchPocketData();
            } else {
                alert(data.message || 'Error al registrar la transacción');
            }
        } catch (error) {
            console.error(error);
            alert('Error en el servidor');
        }
    };

    const handleShowHistory = async () => {
        try {
            const res = await fetch(`https://tesmoney.ddnsfree.com/transactions/${pocket.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setTransactions(data);
                setShowHistoryModal(true);
            } else {
                alert(data.message || 'Error al obtener historial');
            }
        } catch (error) {
            console.error(error);
            alert('Error en el servidor');
        }
    };

    const resetForm = () => {
        setAmount('');
        setDescription('');
        setShowIncomeModal(false);
        setShowExpenseModal(false);
    };

    return (
        <section className='PocketContainer'>
            <div className='PocketContent_textContainer'>
                <h2>
                    <span className="pocketName">Pocket Name |</span>
                    <span className="pockets"> {pocket.name}</span>
                </h2>
                <h2 className="pockets">
                    "
                    <span className="highlight">{pocket.description}</span>
                    "
                </h2>
            </div>

            <div className='textContainer'>
                <h2>${currentPocket.balance}</h2>
            </div>

            <div className='buttonContainer'>
                <button className='button_ingreso' onClick={() => setShowIncomeModal(true)}>Ingreso</button>
                <button className='button_gasto' onClick={() => setShowExpenseModal(true)}>Gasto</button>
                <button className='button_historial' onClick={handleShowHistory}>Historial</button>
            </div>

            {/* Modal de Ingreso */}
            {showIncomeModal && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <h2>Nuevo Ingreso</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('income'); }} className='form_content'>
                            <label>
                                Descripción:
                                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </label>
                            <label>
                                Monto:
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                            </label>
                            <div className='modal_buttons'>
                                <button type="submit">Registrar</button>
                                <button type="button" className='delete_btn' onClick={resetForm}>Cancelar</button>
                            </div>
                        </form>
                        <button className='close_btn' onClick={resetForm}>X</button>
                    </div>
                </div>
            )}

            {/* Modal de Gasto */}
            {showExpenseModal && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <h2>Nuevo Gasto</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('expense'); }} className='form_content'>
                            <label>
                                Descripción:
                                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </label>
                            <label>
                                Monto:
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                            </label>
                            <div className='modal_buttons'>
                                <button type="submit">Registrar</button>
                                <button type="button" className='delete_btn' onClick={resetForm}>Cancelar</button>
                            </div>
                        </form>
                        <button className='close_btn' onClick={resetForm}>X</button>
                    </div>
                </div>
            )}

            {/* Modal de Historial */}
            {showHistoryModal && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <h2>Historial de Transacciones</h2>
                        <div className="history_list">
                            {transactions.length === 0 ? (
                                <p>No hay transacciones registradas.</p>
                            ) : (
                                transactions.map((tx, index) => (
                                    <div key={index} className={`history_item ${tx.type}`}>
                                        <span className="history_amount">
                                            <strong>{tx.type === 'income' ? '+' : '-'}</strong> ${tx.amount}
                                        </span>
                                        <span className="history_description">
                                            {tx.description}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className='modal_buttons'>
                            <button onClick={() => setShowHistoryModal(false)}>Cerrar</button>
                        </div>
                        <button className='close_btn' onClick={() => setShowHistoryModal(false)}>X</button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default PocketContent;

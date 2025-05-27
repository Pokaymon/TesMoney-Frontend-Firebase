import './Css/TopSection.css';

function TopSection() {

    return (
        <section className='HeroContainer'>
            <div className='text_container'>
                <h2>Bienvenido a TesMoney</h2>
                <p>Administra tus billeteras virtuales, registra ingresos y controla tus gastos de manera sencilla. Mantén tus finanzas al día con nuestra aplicación.</p>
            </div>
            <figure className='img_container'>
                <img src="img/TopSection.webp" alt="Hero" />
            </figure>
        </section>
    );
}

export default TopSection;
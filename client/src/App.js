import Routes from './Routes';

function App() {
  const isIosSafari =
    /iP(ad|od|hone)/i.test(window.navigator.userAgent) &&
    /WebKit/i.test(window.navigator.userAgent) &&
    !/(CriOS|FxiOS|OPiOS|mercury)/i.test(window.navigator.userAgent);

  const rootElement = document.getElementById('root');
  if (rootElement) {
    if (isIosSafari) {
      rootElement.classList.add('iosDevice');
    } else {
      rootElement.style.height = '100vh';
    }
  }

  return (
    <>
      <Routes />
    </>
  );
}

export default App;

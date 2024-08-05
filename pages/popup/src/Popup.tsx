import '@src/Popup.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { ComponentPropsWithoutRef, useEffect, useState } from 'react';




interface Artikl {
  id_artikla: number;
  naziv_artikla: string;
  // other properties...
}

const Popup = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'popup/logo_vertical.svg' : 'popup/logo_vertical_dark.svg';

  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      files: ['/content-runtime/index.iife.js'],
    });
  };




  // popup.js

  const [onOffCollor, setOnOffCollor] = useState(true)
  const [higlightArticle, setHighlightArticle] = useState()
  const [popisArtikala, setPopisArtikala] = useState<Artikl[]>([]);
  const [settings, setSettings] = useState({ highlightArticle: 0, onOffCollors: false });




  useEffect(() => {

    injectContentScript()
    setInitialValues()

    chrome.storage.local.get('popisArtikala', function (data) {
      if (!data.popisArtikala) return;

      let noviPopisArtikala = data.popisArtikala.sort((a: any, b: any) => {
        if (a.naziv_artikla < b.naziv_artikla) {
          return -1;
        }
        if (a.naziv_artikla > b.naziv_artikla) {
          return 1;
        }
        return 0;
      });
      setPopisArtikala(noviPopisArtikala)
    })
  }, [])


  useEffect(() => {

    console.log("everyChangeSettings: ", settings)
  }, [settings])

  function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
    chrome.storage.local.set({ "settings": settings });
  }


  function setInitialValues() {
    let oldSettings = localStorage.getItem("settings");
    console.log("OldSettings", oldSettings);
    if (oldSettings) {
      let newSettings = JSON.parse(oldSettings);
      setSettings({ ...settings, ...newSettings });
    } else {
      setSettings({ onOffCollors: false, highlightArticle: 0 });
    }
  }




  const handleSaveForm = () => {
    const newSettings = {
      highlightArticle: higlightArticle ?? 0,
      onOffCollors: onOffCollor,
    };
    setSettings(newSettings);
    saveSettings();
  };








  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />

        <div>

          <h3>Ukljući / Iskljući boje:</h3>
          <input type="checkbox" name="colorCheckbox" id="colorCheckbox" checked={onOffCollor} onChange={(e: any) => setOnOffCollor(e.target.checked)}
          />
          <h3>Naglasi artikl:</h3>


          <select name="highlightArtikl" id="highlightArtikl" value={higlightArticle} onChange={(e: any) => setHighlightArticle(e.target.value)}>
            <option value="0">Default</option>
            {popisArtikala.map((artikl, index) => (

              <option key={index} value={artikl.id_artikla}>{artikl.naziv_artikla}</option>
            ))}
          </select>
          <button onClick={handleSaveForm}>Spremi</button>

        </div>

        <ToggleButton>Toggle theme</ToggleButton>
      </header >
    </div >
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorageSuspense(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black shadow-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);





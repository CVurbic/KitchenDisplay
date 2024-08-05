import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';
import { createClient } from '@supabase/supabase-js';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});


const supabaseUrl = 'https://xxqeupvmmmxltbtxcgvp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cWV1cHZtbW14bHRidHhjZ3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk1Nzk3MDYsImV4cCI6MTk4NTE1NTcwNn0.Pump9exBhsc1TbUGqegEsqIXnmsmlUZMVlo2gSHoYDo';
const supabase = createClient(supabaseUrl, supabaseKey)

const poslovnica = "CCOE"
let settings: any = {}
let highlightArtiklID: number | undefined


chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.storage.local.get("settings", function (data) {
  console.log("StorageOnLoad", data)
  highlightArtiklID = data.settings?.highlightArticle;


  if (highlightArtiklID) {

    sendSupaHighlightArticle(highlightArtiklID)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, { highlightArtiklID: highlightArtiklID });
    })
  }
});

// Prati promjene u lokalnoj pohrani
chrome.storage.onChanged.addListener(function (changes, _namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "settings") {

      console.log(newValue)
      if (oldValue.highlightArticle !== newValue.highlightArticle) {
      }

      sendSupaHighlightArticle(newValue.highlightArticle)
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs.length > 0 && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { settings: newValue });
          settings = newValue
        } else {
          console.error("No active tabs found.");
        }
      });

    }
  }


});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, _tab) {
  if (changeInfo.status === 'complete') {
    // Provjerite je li tab u kojem je stranica učitana aktivan
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0 && tabs[0].id === tabId) {
        // Ako je tab aktivan, pošaljite poruku u content skript
        console.log("onUpdate")
        fetchTheme()
          .then(data => {
            chrome.tabs.sendMessage(tabId, { themes: data });
            chrome.storage.local.set({ themes: data })
          })
          .catch(error => {
            console.error('Greška pri dohvaćanju podataka o temama:', error);
          });
        fetchPopisArtikala()
          .then(popisArtikala => {
            chrome.tabs.sendMessage(tabId, { popisArtikala: popisArtikala });
            chrome.storage.local.set({ popisArtikala: popisArtikala })
          })
          .catch(error => {
            console.error('Greška pri dohvaćanju podataka o popisArtikala:', error);
          });
        fetchHighlightedArticleSupa()
          .then(data => {
            console.log(data)

            chrome.tabs.sendMessage(tabId, { data });
          })
          .catch(error => {
            console.error('Greška pri dohvaćanju podataka o higlightArticle:', error);
          });


      }
    });
  }
});
/* chrome.storage.onChanged.addListener((changes) => {
  console.log("KuracChanged", changes)
  if (changes.settings) {
    const { newValue } = changes.settings;
    highlightArtiklID = newValue?.highlightArticle;
    if (highlightArtiklID) {
      sendSupaHighlightArticle(highlightArtiklID)
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, { highlightArtiklID: highlightArtiklID });
      })
    }

  }
}); */





const fetchHighlightedArticleSupa = async () => {

  let { data: highlight, error } = await supabase
    .from('kdHighlightArticle')
    .select('*')


  if (error) console.log("error", error)

  else {
    console.log("highlightFromSupa", highlight)
    if (highlight && highlight.length > 0) {
      if (settings) settings.highlightArticle = highlight![0].article_ID
      else settings = { highlightArticle: highlight![0].article_ID, onOffCollors: true }
    }
    console.log("settings", settings)
  }
  return (settings)
}

/* async function fetchNotifikacija() {
  const response = await fetch(`${supabaseUrl}/notifications`, {
    method: 'GET',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    }
  });
  let json = await response.json();
  console.log("notifikacija", json)
  return (json)
}
fetchNotifikacija() */

async function sendSupaHighlightArticle(highlightArticleId: number) {
  try {
    const oldHighlightedArticle = await fetchHighlightedArticleSupa();
    console.log("oldHighlightedArticle", oldHighlightedArticle)
    const { highlightArticle } = oldHighlightedArticle;
    if (highlightArticle) {
      await updateHighlightedArticle(highlightArticleId);
      console.log("True", highlightArticle)
    } else {
      await insertHighlightedArticle(highlightArticleId);
      console.log("False", highlightArticle)
    }
  } catch (error: any) {
    throw new Error('Error saving sorted items to Supabase: ' + error.message);
  }
}

async function updateHighlightedArticle(highlightArticleId: number) {
  const { data, error } = await supabase
    .from('kdHighlightArticle')
    .update({
      poslovnica: poslovnica,
      article_ID: highlightArticleId
    })
    .eq("poslovnica", poslovnica)
    .select();
  console.log("123", error)
}

async function insertHighlightedArticle(highlightArticleId: number) {
  const { data, error } = await supabase
    .from('kdHighlightArticle')
    .insert([
      {
        poslovnica: poslovnica,
        article_ID: highlightArticleId
      }
    ])
    .select();
}




async function fetchTheme() {
  let { data: remarisMakeoverThemes, error } = await supabase
    .from('remarisMakeoverThemes')
    .select('*');
  if (error) {
    throw new Error('Unable to fetch locations from Supabase');
  }
  return remarisMakeoverThemes;
}



async function savePopisArtikalaItemsToSupabase(popisArtikala: any) {
  try {
    const { data, error } = await supabase
      .from('artikliRemaris')
      .insert(popisArtikala.map((item: any) => ({
        naziv_artikla: item.itemName,
        id_artikla: item.itemId
      })));
    if (error) {
      throw new Error('Unable to save sorted items to Supabase: ' + error.message);
    }

    return data;
  } catch (error: any) {
    throw new Error('Error saving sorted items to Supabase: ' + error.message);
  }
}




async function fetchPopisArtikala() {
  let { data, error } = await supabase
    .from('artikliRemaris')
    .select('*');
  if (error) {
    throw new Error('Unable to fetch popisArtikala from Supabase: ' + error.message);
  }

  return data;
}


async function removeExistingArikles(sviArtikli: any) {
  const stariArtikli = await fetchPopisArtikala();
  const noviArtikli = sviArtikli.filter((artikl: any) => !stariArtikli!.some((sa: any) => sa.id_artikla === artikl.itemId))


  if (noviArtikli.length > 0) savePopisArtikalaItemsToSupabase(noviArtikli)

}

//https://xxqeupvmmmxltbtxcgvp.supabase.co/rest/v1/kdHighlightArticle


fetchTheme()
fetchPopisArtikala()



async function sendActiveTickets(tickets: any) {
  try {
    const response = await fetch(`${supabaseUrl}/remarisNarudzbe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(tickets.map((ticket: any) => ({
        broj_narudzbe: ticket,
        poslovnica: poslovnica
      })))
    });

    if (!response.ok) {
      throw new Error('Unable to send current tickets to supa');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Greška prilikom slanja trenutnih karata u Supabazu:', error);
    throw error;
  }
}

async function fetchActiveTickets() {

  const response = await fetch(`${supabaseUrl}/remarisNarudzbe?poslovnica=eq.${poslovnica}`, {
    method: 'GET',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    }
  });

  if (!response.ok) {
    throw new Error('Unable to fetch popisArtikala from Supabase');
  }
  const responseData = await response.json(); // Pokušaj parsiranja JSON-a
  return responseData; // Vrati parsirane podatke

}



chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  console.log(message)
  if (message.allTicketItems) {
    removeExistingArikles(message.allTicketItems)
    return true
  }

  if (message.action === "fetchActiveTickets") {
    try {
      const responseData = await fetchActiveTickets();
      sendResponse(JSON.stringify(responseData));
      return true;
    } catch (error: any) {
      sendResponse({ error: error.message });
      return false
    }
    // return true; // Ovo osigurava da se zadrži otvoren kanal za poruke
  }


  if (message.ticketsUIzradi) {
    const trenutneNarudzbeUSupa = await fetchActiveTickets();
    const trenutneNarudzbeNaEkranu = message.ticketsUIzradi;

    const noveNarudzbe = trenutneNarudzbeNaEkranu.filter((narudzba: any) => {
      return !trenutneNarudzbeUSupa.some((n: any) => parseInt(n.broj_narudzbe) === parseInt(narudzba));
    });
    if (noveNarudzbe.length > 0) {
      sendActiveTickets(noveNarudzbe)
        .then(() => {
          sendResponse({ success: true });
        })
        .catch(error => {
          console.error('Greška pri spremanju sortiranih stavki na Supabase:', error);
          sendResponse({ success: false });
          return false
        });
    }
    return true;
  }

  if (message.popisArtikala) {
    const popisArtikala = message.popisArtikala;
    removeExistingArikles(popisArtikala)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Greška pri spremanju sortiranih stavki na Supabase:', error);
        sendResponse({ success: false });
        return false
      });
    return true;
  }

  return true
});





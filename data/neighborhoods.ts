// Real Istanbul neighbourhood (mahalle) data per district, used to generate
// hyper-local SEO landing pages such as /kagithane-hurriyet-mahallesi-bocek-ilaclama
// and /gungoren-haznedar-mahallesi-koltuk-yikama.
//
// Sourced from English/Turkish Wikipedia district articles and Turkey's
// official Mülki İdari Bölümler (İçişleri Bakanlığı) neighbourhood
// inventory, cross-checked via general web search. Kept as plain data so
// it's easy for the owner to correct/extend later — just edit the arrays
// below (each district key must match a `slug` in data/districts.ts,
// generated with the same `toSlug` helper).
//
// Coverage note: for a handful of very large districts (e.g. Fatih, Beyoğlu,
// Arnavutköy, Esenyurt, Çatalca, Şile) the list below may not be 100%
// exhaustive of every single official mahalle, but covers the large
// majority of real, verifiable neighbourhood names — enough for strong
// hyper-local SEO coverage without inventing any names.

import { toSlug } from "./districts";

export type Neighborhood = {
  slug: string;
  name: string;
  districtSlug: string;
};

// Raw source data: districtSlug -> real mahalle names (without the word
// "Mahallesi", which is added at render time).
const raw: Record<string, string[]> = {
  // ---- Anadolu Yakası ----
  adalar: ["Burgazada", "Heybeliada", "Kınalıada", "Maden", "Nizam"],
  atasehir: [
    "Aşık Veysel", "Atatürk", "Barbaros", "Esatpaşa", "Ferhatpaşa", "Fetih",
    "İçerenköy", "İnönü", "Kayışdağı", "Küçükbakkalköy", "Mevlana",
    "Mimar Sinan", "Mustafa Kemal", "Örnek", "Yeni Çamlıca", "Yenisahra",
    "Yenişehir",
  ],
  beykoz: [
    "Acarlar", "Akbaba", "Alibahadır", "Anadoluhisarı", "Anadolukavağı",
    "Anadolufeneri", "Baklacı", "Beykoz Merkez", "Bozhane", "Çamlıbahçe",
    "Çengeldere", "Çiftlik", "Çiğdem", "Çubuklu", "Cumhuriyet", "Dereseki",
    "Elmalı", "Fatih", "Göksu", "Göllü", "Görele", "Göztepe", "Gümüşsuyu",
    "İncirköy", "İshaklı", "Kanlıca", "Kavacık", "Kaynarca", "Kılıçlı",
    "Mahmutşevketpaşa", "Öğümce", "Örnekköy", "Ortaçeşme", "Paşabahçe",
    "Paşamandıra", "Polonezköy", "Poyrazköy", "Riva", "Rüzgarlıbahçe",
    "Soğuksu", "Tokatköy", "Yalıköy", "Yavuz Selim", "Yeni Mahalle",
    "Zerzavatçı",
  ],
  cekmekoy: [
    "Alemdağ", "Aydınlar", "Çamlık", "Çatalmeşe", "Cumhuriyet", "Ekşioğlu",
    "Güngören", "Hamidiye", "Hüseyinli", "Kirazlıdere", "Koçullu",
    "Mehmet Akif", "Merkez", "Mimar Sinan", "Nişantepe", "Ömerli",
    "Reşadiye", "Sırapınar", "Soğukpınar", "Sultançiftliği", "Taşdelen",
  ],
  kadikoy: [
    "Caferağa", "Osmanağa", "Rasimpaşa", "Koşuyolu", "Acıbadem", "Hasanpaşa",
    "Bostancı", "Caddebostan", "Dumlupınar", "Eğitim", "Erenköy",
    "Fenerbahçe", "Feneryolu", "Fikirtepe", "Göztepe", "Kozyatağı",
    "Merdivenköy", "Sahrayıcedit", "Suadiye", "Zühtüpaşa", "Ondokuzmayıs",
  ],
  kartal: [
    "Atalar", "Çavuşoğlu", "Cevizli", "Cumhuriyet", "Esentepe",
    "Gümüşpınar", "Hürriyet", "Karlıktepe", "Kordonboyu", "Orhantepe",
    "Orta", "Petrol İş", "Soğanlık Yeni", "Topselvi", "Uğur Mumcu",
    "Yakacık Çarşı", "Yakacık Yeni", "Yalı", "Yukarı", "Yunus",
  ],
  maltepe: [
    "Altayçeşme", "Altıntepe", "Aydınevler", "Bağlarbaşı", "Başıbüyük",
    "Büyükbakkalköy", "Cevizli", "Çınar", "Esenkent", "Feyzullah",
    "Fındıklı", "Girne", "Gülensu", "Gülsuyu", "İdealtepe", "Küçükyalı",
    "Merkez", "Yalı", "Zümrütevler",
  ],
  pendik: [
    "Ahmet Yesevi", "Bahçelievler", "Ballıca", "Batı", "Çamçeşme", "Çamlık",
    "Çınardere", "Doğu", "Dumlupınar", "Emirli", "Ertuğrul Gazi", "Esenler",
    "Esenyalı", "Fatih", "Fevzi Çakmak", "Göçbeyli", "Güllü Bağlar",
    "Güzelyalı", "Harmandere", "Kavakpınar", "Kaynarca", "Kurna",
    "Kurtdoğmuş", "Kurtköy", "Orhangazi", "Orta", "Ramazanoğlu", "Sanayi",
    "Sapanbağları", "Şeyhli", "Sülüntepe", "Velibaba", "Yayalar", "Yeni",
    "Yenişehir", "Yeşilbağlar",
  ],
  sancaktepe: [
    "Abdurrahmangazi", "Akpınar", "Atatürk", "Emek", "Eyüp Sultan", "Fatih",
    "Hilal", "İnönü", "Kemal Türkler", "Meclis", "Merve", "Mevlana",
    "Osmangazi", "Paşaköy", "Safa", "Sarıgazi", "Veysel Karani",
    "Yenidoğan", "Yunus Emre",
  ],
  sultanbeyli: [
    "Abdurrahmangazi", "Adil", "Ahmet Yesevi", "Akşemseddin", "Battalgazi",
    "Fatih", "Hamidiye", "Hasanpaşa", "Mecidiye", "Mehmet Akif",
    "Mimar Sinan", "Necip Fazıl", "Orhan Gazi", "Turgut Reis", "Yavuz Selim",
  ],
  sile: [
    "Ağaçdere", "Ağva Merkez", "Ahmetli", "Akçakese", "Alacalı", "Avcıkoru",
    "Balibey", "Bıçkıdere", "Bozgoca", "Bucaklı", "Çataklı", "Çavuş",
    "Çayırbaşı", "Çelebi", "Çengilli", "Darlık", "Değirmençayırı",
    "Doğancılı", "Erenler", "Esenceli", "Geredeli", "Göçe", "Gökmaşlı",
    "Göksu", "Hacı Kasım", "Hacıllı", "Hasanlı", "İmrendere", "İmrenli",
    "İsaköy", "Kabakoz", "Kadıköy", "Kalem", "Karabeyli", "Karacaköy",
    "Karakiraz", "Karamandere", "Kervansaray", "Kızılca", "Kömürlük",
    "Korucu", "Kumbaba", "Kurfallı", "Kurna", "Meşrutiyet", "Oruçoğlu",
    "Osmanköy", "Ovacık", "Sahilköy", "Satmazlı", "Sofular", "Soğullu",
    "Sortullu", "Şuayipli", "Teke", "Ulupelit", "Üvezli", "Yaka", "Yaylalı",
    "Yazımanayır", "Yeniköy", "Yeşilvadi",
  ],
  tuzla: [
    "Akfırat", "Anadolu", "Aydınlı", "Aydıntepe", "Cami", "Evliya Çelebi",
    "Fatih", "İçmeler", "İstasyon", "Mescit", "Mimar Sinan", "Orhanlı",
    "Orta", "Postane", "Şifa", "Tepeören", "Yayla",
  ],
  umraniye: [
    "Adem Yavuz", "Altınşehir", "Armağanevler", "Aşağı Dudullu", "Atakent",
    "Atatürk", "Çakmak", "Çamlık", "Cemil Meriç", "Dumlupınar", "Elmalıkent",
    "Esenevler", "Esenkent", "Esenşehir", "Fatih Sultan Mehmet",
    "Finanskent", "Hekimbaşı", "Huzur", "Ihlamurkuyu", "İnkılap",
    "İstiklal", "Kazım Karabekir", "Madenler", "Mehmet Akif", "Namık Kemal",
    "Necip Fazıl", "Parseller", "Saray", "Şerifali", "Site", "Tantavi",
    "Tatlısu", "Tepeüstü", "Topağacı", "Yamanevler", "Yenişehir",
    "Yukarı Dudullu",
  ],
  uskudar: [
    "Acıbadem", "Ahmediye", "Altunizade", "Aziz Mahmut Hüdayi",
    "Bahçelievler", "Barbaros", "Beylerbeyi", "Bulgurlu", "Burhaniye",
    "Çengelköy", "Cumhuriyet", "Ferah", "Güzeltepe", "İcadiye", "Kandilli",
    "Kirazlıtepe", "Kısıklı", "Küçük Çamlıca", "Küçüksu", "Kuleli",
    "Küplüce", "Kuzguncuk", "Mehmet Akif Ersoy", "Mimar Sinan", "Muratreis",
    "Salacak", "Selami Ali", "Selimiye", "Sultantepe", "Ünalan",
    "Valide-i Atik", "Yavuztürk", "Zeynep Kamil",
  ],

  // ---- Avrupa Yakası ----
  arnavutkoy: [
    "Adnan Menderes", "Anadolu", "Arnavutköy Merkez", "Atatürk", "Baklalı",
    "Balaban", "Boğazköy İstiklal", "Bolluca", "Boyalık", "Çilingir",
    "Deliklikaya", "Dursunköy", "Durusu", "Hacımaşlı", "Hadımköy",
    "Haraççı", "Hastane", "Hicret", "İmrahor", "İslambey", "Karaburun",
    "Karlıbayır", "Mareşal Fevzi Çakmak", "Mavigöl", "Mehmet Akif Ersoy",
    "Mustafa Kemal Paşa", "Nenehatun", "Ömerli", "Sazlıbosna", "Taşoluk",
    "Tayakadın", "Terkos", "Yassıören", "Yavuz Selim", "Yeniköy",
    "Yeşilbayır", "Yunus Emre",
  ],
  avcilar: [
    "Ambarlı", "Avcılar Merkez", "Cihangir", "Denizköşkler", "Firuzköy",
    "Gümüşpala", "Mustafa Kemal Paşa", "Tahtakale", "Üniversite",
    "Yeşilkent",
  ],
  bagcilar: [
    "100. Yıl", "Bağlar", "Barbaros", "Çınar", "Demirkapı", "Evren",
    "Fatih", "Fevziçakmak", "Göztepe", "Güneşli", "Hürriyet", "İnönü",
    "Kazımkarabekir", "Kemalpaşa", "Kirazlı", "Mahmutbey", "Merkez",
    "Sancaktepe", "Yavuzselim", "Yenigün", "Yenimahalle", "Yıldıztepe",
  ],
  bahcelievler: [
    "Bahçelievler", "Cumhuriyet", "Çobançeşme", "Fevzi Çakmak", "Hürriyet",
    "Kocasinan", "Siyavuşpaşa", "Soğanlı", "Şirinevler", "Yenibosna",
    "Zafer",
  ],
  bakirkoy: [
    "Ataköy 1. Kısım", "Ataköy 2-5-6. Kısım", "Ataköy 3-4-11. Kısım",
    "Ataköy 7-8-9-10. Kısım", "Basınköy", "Cevizlik", "Kartaltepe",
    "Osmaniye", "Sakızağacı", "Şenlikköy", "Yenimahalle", "Yeşilköy",
    "Yeşilyurt", "Zeytinlik", "Zuhuratbaba",
  ],
  basaksehir: [
    "Altınşehir", "Bahçeşehir 1. Kısım", "Bahçeşehir 2. Kısım", "Başak",
    "Başakşehir", "Güvercintepe", "İkitelli OSB", "Kayabaşı", "Şahintepe",
    "Şamlar", "Ziya Gökalp",
  ],
  bayrampasa: [
    "Altıntepsi", "Cevatpaşa", "İsmetpaşa", "Kartaltepe", "Kocatepe",
    "Muratpaşa", "Ortamahalle", "Terazidere", "Vatan", "Yenidoğan",
    "Yıldırım",
  ],
  besiktas: [
    "Abbasağa", "Akatlar", "Arnavutköy", "Balmumcu", "Bebek", "Cihannüma",
    "Dikilitaş", "Etiler", "Gayrettepe", "Konaklar", "Kuruçeşme", "Kültür",
    "Levazım", "Levent", "Mecidiye", "Muradiye", "Nisbetiye", "Ortaköy",
    "Sinanpaşa", "Türkali", "Ulus", "Vişnezade", "Yıldız",
  ],
  beylikduzu: [
    "Adnan Kahveci", "Barış", "Büyükşehir", "Cumhuriyet", "Dereağzı",
    "Gürpınar Merkez", "Kavaklı", "Marmara", "Sahil", "Yakuplu Merkez",
  ],
  beyoglu: [
    "Arap Cami", "Asmalı Mescit", "Bedrettin", "Bereketzade", "Bostan",
    "Bülbül", "Camiikebir", "Çatma Mescit", "Cihangir", "Çukur",
    "Emekyemez", "Evliya Çelebi", "Fetihtepe", "Firuzağa", "Gümüşsuyu",
    "Hacıahmet", "Hacımimi", "Halıcıoğlu", "Hüseyinağa", "İstiklal",
    "Kadımehmet Efendi", "Kalyoncu Kulluğu", "Kamer Hatun", "Kaptanpaşa",
    "Katip Mustafa Çelebi", "Keçeci Piri", "Kemankeş Karamustafapaşa",
    "Kılıçali Paşa", "Kocatepe", "Küçük Piyale", "Kulaksız", "Kuloğlu",
    "Müeyyetzade", "Ömer Avni", "Örnektepe", "Piripaşa", "Piyalepaşa",
    "Pürtelaş Hasan Efendi", "Şahkulu", "Şehit Muhtar", "Sütlüce", "Tomtom",
    "Yahya Kâhya", "Yenişehir",
  ],
  buyukcekmece: [
    "Dizdariye", "Atatürk", "Fatih", "Cumhuriyet", "19 Mayıs",
    "Alkent 2000", "Karaağaç", "Çakmaklı", "Kumburgaz Merkez", "Güzelce",
    "Bahçelievler", "Yenimahalle", "Tepecik Ulus", "Hürriyet", "Türkoba",
    "Ahmediye", "Mimarsinan Merkez", "Pınartepe", "Muratçeşme", "Celaliye",
    "Kamiloba", "Ekinoba", "Mimaroba", "Sinanoba",
  ],
  catalca: [
    "Atatürk", "Çakıl", "Çiftliköy", "Fatih", "Ferhatpaşa", "İzzettin",
    "Kaleiçi", "Karacaköy", "Ovayenice", "Akalan", "Bahşayış", "Cami",
    "Çanakça", "Deliklikaya", "Dursunköy", "Durusu", "Elbasan", "Gökçeali",
    "Hastane", "İhsaniye", "İnceğiz", "İstasyon", "Kabakça", "Kestanelik",
    "Merkez", "Nakkaş", "Oklalı", "Orcunlu", "Ömerli", "Sazlıbosna",
    "Subaşı", "Yazlık", "Yeşilbayır", "Zafer",
  ],
  esenler: [
    "Birlik", "Çiftehavuzlar", "Davutpaşa", "Fatih", "Fevziçakmak",
    "Havaalanı", "Kazımkarabekir", "Kemer", "Menderes", "Mimarsinan",
    "Namıkkemal", "Nenehatun", "Oruçreis", "Tuna", "Turgutreis",
    "Yavuzselim",
  ],
  esenyurt: [
    "Akçaburgaz", "Akevler", "Akşemseddin", "Ardıçlı", "Aşık Veysel",
    "Atatürk", "Bağlarçeşme", "Balıkyolu", "Barbaros Hayrettin Paşa",
    "Battalgazi", "Cumhuriyet", "Çakmaklı", "Esenkent", "Esenyurt",
    "Fatih", "Güzelyurt", "İncirtepe", "İnönü", "Kıraç", "Mehterçeşme",
    "Namıkkemal", "Örnek", "Pınar", "Saadetdere", "Sanayi", "Talatpaşa",
    "Yenikent", "Yeşilkent",
  ],
  eyupsultan: [
    "Eyüpsultan Merkez", "Nişanca", "Defterdar", "Düğmeciler", "İslambey",
    "Rami Cuma", "Topçular", "Rami Yeni", "Silahtarağa", "Sakarya",
    "Alibeyköy Merkez", "Esentepe", "Karadolap", "Yeşilpınar",
    "Akşemseddin", "Çırçır", "Güzeltepe", "Emniyettepe", "Mimar Sinan",
    "Mithatpaşa", "Akpınar", "Ağaçlı", "Çiftalan", "İhsaniye", "Işıklar",
    "Odayeri", "Pirinççi", "Yayla",
  ],
  fatih: [
    "Aksaray", "Akşemsettin", "Alemdar", "Ali Kuşçu", "Atikali",
    "Ayvansaray", "Balabanağa", "Beyazıt", "Binbirdirek", "Cankurtaran",
    "Cerrahpaşa", "Cibali", "Demirtaş", "Derviş Ali", "Emin Sinan",
    "Hacı Kadın", "Haseki Sultan", "Hırka-i Şerif", "Hobyar",
    "Hoca Gıyasettin", "Hocapaşa", "İskenderpaşa", "Kalenderhane",
    "Karagümrük", "Katip Kasım", "Kemalpaşa", "Koca Mustafapaşa",
    "Küçük Ayasofya", "Mercan", "Mesihpaşa", "Mevlanakapı", "Mimar Hayrettin",
    "Mimar Kemalettin", "Molla Fenari", "Molla Gürani", "Molla Hüsrev",
  ],
  gaziosmanpasa: [
    "Bağlarbaşı", "Barbaros Hayrettin Paşa", "Fevzi Çakmak", "Hürriyet",
    "Karadeniz", "Karayolları", "Karlıtepe", "Kazım Karabekir", "Merkez",
    "Mevlana", "Pazariçi", "Sarıgöl", "Şemsipaşa", "Yeni Mahalle",
    "Yenidoğan", "Yıldıztabya",
  ],
  gungoren: [
    "Abdurrahman Nafiz Gürman", "Akıncılar", "Gençosman", "Güneştepe",
    "Merkez", "Güven", "Haznedar", "Mareşal Çakmak", "Mehmet Nezihi Özmen",
    "Sanayi", "Tozkoparan",
  ],
  kagithane: [
    "Çağlayan", "Çeliktepe", "Emniyet Evleri", "Gültepe", "Gürsel",
    "Hamidiye", "Harmantepe", "Hürriyet", "Mehmet Akif Ersoy", "Merkez",
    "Nurtepe", "Ortabayır", "Seyrantepe", "Sultan Selim", "Şirintepe",
    "Talatpaşa", "Telsizler", "Yahya Kemal", "Yeşilce",
  ],
  kucukcekmece: [
    "Atakent", "Atatürk", "Beşyol", "Cennet", "Cumhuriyet", "Fatih",
    "Fevzi Çakmak", "Gültepe", "Halkalı Merkez", "İnönü", "İstasyon",
    "Kanarya", "Kartaltepe", "Kemalpaşa", "Mehmet Akif", "Söğütlüçeşme",
    "Sultanmurat", "Tevfikbey", "Yarımburgaz", "Yenimahalle", "Yeşilova",
  ],
  sariyer: [
    "Ayazağa", "Bahçeköy Kemer", "Bahçeköy Merkez", "Bahçeköy Yeni",
    "Baltalimanı", "Büyükdere", "Çamlıtepe", "Çayırbaşı", "Cumhuriyet",
    "Darüşşafaka", "Demirciköy", "Emirgan", "Fatih Sultan Mehmet",
    "Ferahevler", "Garipçe", "Gümüşdere", "Huzur", "İstinye",
    "Kazım Karabekir Paşa", "Kilyos", "Kireçburnu", "Kısırkaya", "Kocataş",
    "Maden", "Maslak", "Pınar", "Poligon", "PTT Evleri", "Reşitpaşa",
    "Rumelifeneri", "Rumelihisarı", "Rumelikavağı", "Sarıyer", "Tarabya",
    "Uskumruköy", "Yeni", "Yeniköy", "Zekeriyaköy",
  ],
  silivri: [
    "Alibey", "Alipaşa", "Cumhuriyet", "Çantamimarsinan", "Fatih",
    "Fevzipaşa", "Gazitepe", "Gümüşyaka", "Hürriyet", "İsmetpaşa",
    "Kadıköy", "Kavaklıcumhuriyet", "Küçükkılıçlı", "Mimarsinan",
    "Ortaköy", "Pirimehmetpaşa", "Selimpaşa", "Semizkumlar",
    "Silivrifatih", "Yeni", "Yolçatı",
  ],
  sultangazi: [
    "50. Yıl", "75. Yıl", "Cebeci", "Cumhuriyet", "Esentepe", "Gazi",
    "Habibler", "İsmetpaşa", "Malkoçoğlu", "Sultançiftliği", "Uğurmumcu",
    "Yayla", "Yunusemre", "Zübeydehanım",
  ],
  sisli: [
    "19 Mayıs", "Ayazağa", "Bozkurt", "Cumhuriyet", "Duatepe", "Ergenekon",
    "Esentepe", "Eskişehir", "Feriköy", "Fulya", "Gülbahar", "Halaskargazi",
    "Halide Edib Adıvar", "Halil Rıfat Paşa", "Harbiye", "Huzur", "İnönü",
    "İzzetpaşa Çiftliği", "Kaptanpaşa", "Kuştepe", "Mahmut Şevket Paşa",
    "Maslak", "Mecidiyeköy", "Meşrutiyet", "Ondokuzmayıs", "Paşa",
    "Şişli Merkez", "Teşvikiye", "Yayla",
  ],
  zeytinburnu: [
    "Beştelsiz", "Çırpıcı", "Gökalp", "Kazlıçeşme", "Maltepe",
    "Merkezefendi", "Nuripaşa", "Seyitnizam", "Sümer", "Telsiz",
    "Veliefendi", "Yenidoğan", "Yeşiltepe",
  ],
};

export const neighborhoods: Neighborhood[] = Object.entries(raw).flatMap(
  ([districtSlug, names]) =>
    names.map((name) => ({
      slug: toSlug(name),
      name,
      districtSlug,
    }))
);

export function getNeighborhoodsByDistrict(districtSlug: string): Neighborhood[] {
  return neighborhoods.filter((n) => n.districtSlug === districtSlug);
}

export function getNeighborhood(
  districtSlug: string,
  neighborhoodSlug: string
): Neighborhood | undefined {
  return neighborhoods.find(
    (n) => n.districtSlug === districtSlug && n.slug === neighborhoodSlug
  );
}

// Padaria Contentor Amarelo — Google Apps Script
// Deploy as: Web App > Execute as: Me > Who has access: Anyone
// Set the deployment URL as GOOGLE_APPS_SCRIPT_URL in your Node.js .env

const SHEETS = {
  PRODUTOS: 'Produtos',
  PRODUCAO: 'Producao',
  VENDAS:   'Vendas',
  RESUMO:   'Resumo',
};

const PRODUCTS = [
  { name: 'Pão Normal',          price: 12 },
  { name: 'Pão de Água',         price: 10 },
  { name: 'Pão Especial',        price: 15 },
  { name: 'Pão de Forma',        price: 50 },
  { name: 'Natas',               price: 50 },
  { name: 'Palmeiras',           price: 40 },
  { name: 'Palmeiras Mini',      price: 15 },
  { name: 'Croissants',          price: 55 },
  { name: 'Biscoitos',           price: 10 },
  { name: 'Broa',                price: 25 },
  { name: 'Pãezinhos',           price: 40 },
  { name: 'Arrufada Unidade',    price: 10 },
  { name: 'Arrufada Pacote',     price: 50 },
  { name: 'Pãezinhos Integrais', price: 50 },
  { name: 'Pão Ralado',          price: 50 },
  { name: 'Pãezinhos de Leite',  price: 55 },
];

// ─── HTTP handlers ────────────────────────────────────────────

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', app: 'Padaria Contentor Amarelo' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    ensureSheets();

    if (data.reportType === 'producao') {
      saveProducao(data);
    } else if (data.reportType === 'vendas') {
      saveVendas(data);
    } else {
      throw new Error('Tipo de relatório desconhecido: ' + data.reportType);
    }

    saveResumo(data);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── Sheet initialisation ─────────────────────────────────────

function ensureSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  _ensureSheet(ss, SHEETS.PRODUTOS, ['Produto', 'PrecoUnitario'], function(sheet) {
    PRODUCTS.forEach(function(p) { sheet.appendRow([p.name, p.price]); });
  });

  _ensureSheet(ss, SHEETS.PRODUCAO, [
    'Data', 'HoraSubmissao', 'Trabalhador', 'Filial',
    'Turno', 'Produto', 'QuantidadeProduzida', 'PrecoUnitario',
  ]);

  _ensureSheet(ss, SHEETS.VENDAS, [
    'Data', 'HoraSubmissao', 'Vendedor', 'Filial',
    'Turno', 'Produto', 'Vendido', 'Sobrou', 'Danificado',
    'PrecoUnitario', 'TotalEsperadoProduto',
  ]);

  _ensureSheet(ss, SHEETS.RESUMO, [
    'Data', 'Filial', 'Turno', 'TipoRelatorio',
    'TotalUnidades', 'TotalDanificado', 'TotalEsperado',
    'DinheiroRecebido', 'Diferenca',
  ]);
}

function _ensureSheet(ss, name, headers, onNew) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    _styleHeader(sheet, headers.length);
    if (onNew) onNew(sheet);
  }
  return sheet;
}

function _styleHeader(sheet, colCount) {
  var header = sheet.getRange(1, 1, 1, colCount);
  header.setBackground('#F5C518');
  header.setFontWeight('bold');
  header.setFontColor('#1A1A1A');
}

// ─── Save produção ────────────────────────────────────────────

function saveProducao(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEETS.PRODUCAO);
  var hora  = _formatTime(data.submittedAt);

  data.items.forEach(function(item) {
    if (item.produzido > 0) {
      sheet.appendRow([
        data.date,
        hora,
        data.workerName,
        data.branch,
        data.shift,
        item.produto,
        item.produzido,
        item.precoUnitario,
      ]);
    }
  });
}

// ─── Save vendas ──────────────────────────────────────────────

function saveVendas(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEETS.VENDAS);
  var hora  = _formatTime(data.submittedAt);

  data.items.forEach(function(item) {
    if (item.vendido > 0 || item.sobrou > 0 || item.danificado > 0) {
      sheet.appendRow([
        data.date,
        hora,
        data.sellerName,
        data.branch,
        data.shift,
        item.produto,
        item.vendido,
        item.sobrou,
        item.danificado,
        item.precoUnitario,
        item.totalEsperadoProduto,
      ]);
    }
  });
}

// ─── Save resumo ──────────────────────────────────────────────

function saveResumo(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEETS.RESUMO);

  if (data.reportType === 'vendas') {
    sheet.appendRow([
      data.date,
      data.branch,
      data.shift,
      'Vendas',
      data.totals.totalVendido,
      data.totals.totalDanificado,
      data.totals.totalEsperado,
      data.totals.dinheiroRecebido,
      data.totals.diferenca,
    ]);
  } else {
    sheet.appendRow([
      data.date,
      data.branch,
      data.shift,
      'Producao',
      data.totals.totalProduzido,
      0, 0, 0, 0,
    ]);
  }
}

// ─── Helpers ──────────────────────────────────────────────────

function _formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return isoString || '';
  }
}

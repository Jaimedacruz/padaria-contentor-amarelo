'use strict';

const PRODUCTS = [
  { name: 'Pão Normal',           price: 12 },
  { name: 'Magueva',              price: 10, vendasOnly: true },
  { name: 'Pão de Água',          price: 10 },
  { name: 'Pão Especial',         price: 15 },
  { name: 'Pão de Forma',         price: 50 },
  { name: 'Biscoitos',            price: 10 },
  { name: 'Broa',                 price: 25 },
  { name: 'Pãezinhos',            price: 40 },
  { name: 'Arrufada Unidade',     price: 10 },
  { name: 'Arrufada Pacote',      price: 50 },
  { name: 'Pãezinhos Integrais',  price: 50 },
  { name: 'Pãezinhos de Leite',   price: 55 },
  { name: 'Natas',                price: 50 },
  { name: 'Palmeiras',            price: 40 },
  { name: 'Palmeiras Mini',       price: 15 },
  { name: 'Croissants',           price: 55 },
  { name: 'Pão Ralado',           price: 50 },
];

const INGREDIENTS = {
  'Pão Normal': [
    { name: 'Farinha',  unit: 'kg', ref: '25' },
    { name: 'Sal',      unit: 'g',  ref: '250' },
    { name: 'Vitamina', unit: 'g',  ref: '40' },
    { name: 'Fermento', unit: 'g',  ref: '100–150' },
  ],
  'Pão Especial': [
    { name: 'Farinha',  unit: 'kg', ref: '25' },
    { name: 'Sal',      unit: 'g',  ref: '250' },
    { name: 'Vitamina', unit: 'g',  ref: '40' },
    { name: 'Fermento', unit: 'g',  ref: '200–250' },
    { name: 'Manteiga', unit: 'g',  ref: '250' },
    { name: 'Açúcar',   unit: 'g',  ref: '100' },
  ],
  'Pão de Água': [
    { name: 'Farinha',  unit: 'kg', ref: '15' },
    { name: 'Sal',      unit: 'g',  ref: '150' },
    { name: 'Vitamina', unit: 'g',  ref: '30' },
    { name: 'Fermento', unit: 'g',  ref: '200–250' },
  ],
  'Pão de Forma': [
    { name: 'Farinha',          unit: 'kg', ref: '2' },
    { name: 'Ovos',             unit: 'un', ref: '3' },
    { name: 'Açúcar',           unit: 'g',  ref: '100' },
    { name: 'Vitamina',         unit: 'g',  ref: '10' },
    { name: 'Manteiga',         unit: 'g',  ref: '100' },
    { name: 'Leite',            unit: 'ml', ref: '250' },
    { name: 'Fermento',         unit: 'g',  ref: '80–100' },
  ],
  'Biscoitos': [
    { name: 'Farinha',          unit: 'kg',    ref: '3' },
    { name: 'Açúcar',           unit: 'g',     ref: '750' },
    { name: 'Maizena',          unit: 'g',     ref: '150' },
    { name: 'Ovos',             unit: 'un',    ref: '12' },
    { name: 'Fermento Royal',   unit: 'g',     ref: '120' },
    { name: 'Leite Fresco',     unit: 'ml',    ref: '500' },
    { name: 'Leite Condensado', unit: 'latas', ref: '1' },
    { name: 'Manteiga',         unit: 'kg',    ref: '1' },
  ],
  'Broa': [
    { name: 'Farinha de Milho',  unit: 'kg',       ref: '1' },
    { name: 'Farinha de Trigo',  unit: 'g',        ref: '700' },
    { name: 'Corante',           unit: 'colheres', ref: '1' },
    { name: 'Açúcar',            unit: 'g',        ref: '100' },
    { name: 'Farinha Integral',  unit: 'g',        ref: '100' },
  ],
  'Pãezinhos': [
    { name: 'Farinha',  unit: 'kg', ref: '5' },
    { name: 'Sal',      unit: 'g',  ref: '50' },
    { name: 'Vitamina', unit: 'g',  ref: '15' },
    { name: 'Fermento', unit: 'g',  ref: '80–100' },
  ],
  'Arrufada Unidade': [
    { name: 'Farinha',  unit: 'kg',       ref: '2' },
    { name: 'Açúcar',   unit: 'g',        ref: '350' },
    { name: 'Corante',  unit: 'colheres', ref: '1' },
    { name: 'Manteiga', unit: 'g',        ref: '100' },
    { name: 'Canela',   unit: 'colheres', ref: '1' },
    { name: 'Fermento', unit: 'g',        ref: '100' },
  ],
  'Arrufada Pacote': [
    { name: 'Farinha',  unit: 'kg',       ref: '15' },
    { name: 'Açúcar',   unit: 'kg',       ref: '1.8' },
    { name: 'Corante',  unit: 'colheres', ref: '2' },
    { name: 'Manteiga', unit: 'g',        ref: '250' },
    { name: 'Fermento', unit: 'g',        ref: '150' },
  ],
  'Pãezinhos Integrais': [
    { name: 'Farinha Integral', unit: 'kg', ref: '1' },
    { name: 'Fermento',         unit: 'g',  ref: '100' },
    { name: 'Vitamina',         unit: 'g',  ref: '10' },
  ],
};

const App = (() => {
  let vendasShift   = 'Noite';
  let prodShift     = 'Noite';
  let pendingType   = 'vendas'; // type waiting for shift selection

  // ─── Navigation ───────────────────────────────────────────────

  function goToShiftPick(type) {
    pendingType = type;
    const labels = { vendas: '🛒 Vendas', producao: '🥖 Produção' };
    document.getElementById('shift-pick-title').textContent = labels[type] || type;
    _showScreen('screen-shift-pick');
  }

  function goToFromShiftPick(shift) {
    goTo(pendingType, shift);
  }

  function goTo(screen, shift) {
    if (screen === 'vendas') {
      _resetVendasForm();
      _renderVendasProducts();
      _showScreen('screen-vendas');
    } else if (screen === 'producao') {
      prodShift = shift;
      document.getElementById('prod-title').textContent =
        'Produção — ' + (shift === 'Noite' ? '🌙 Noite' : '☀️ Manhã');
      _resetProdForm();
      _renderProdProducts();
      _showScreen('screen-producao');
    } else if (screen === 'resumo') {
      _renderResumo();
      _showScreen('screen-resumo');
    }
  }

  function goHome() {
    _showScreen('screen-home');
  }

  function _showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
  }

  // ─── Form resets ──────────────────────────────────────────────

  function _today() {
    return new Date().toISOString().split('T')[0];
  }

  function _resetVendasForm() {
    document.getElementById('vendas-data').value = _today();
    const dinheiroEl = document.getElementById('dinheiro-recebido');
    if (dinheiroEl) dinheiroEl.value = '';
    const depositadoEl = document.getElementById('dinheiro-depositado');
    if (depositadoEl) depositadoEl.value = '';
    const cofreEl = document.getElementById('dinheiro-cofre');
    if (cofreEl) cofreEl.value = '';
    const comentarioEl = document.getElementById('vendas-comentario');
    if (comentarioEl) comentarioEl.value = '';
    _saidaCount = 0;
    const saidasList = document.getElementById('saidas-list');
    if (saidasList) saidasList.innerHTML = '';
    _encCount = 0;
    const encList = document.getElementById('encomendas-list');
    if (encList) encList.innerHTML = '';
    const banner = document.getElementById('status-banner');
    if (banner) { banner.textContent = ''; banner.className = 'status-banner'; }
    const diffEl = document.getElementById('tot-diferenca');
    if (diffEl) diffEl.textContent = '—';
  }

  function _resetProdForm() {
    document.getElementById('prod-data').value = _today();
    const c = document.getElementById('prod-comentario');
    if (c) c.value = '';
  }

  // ─── Render product cards ──────────────────────────────────────

  function _renderVendasProducts() {
    const container = document.getElementById('vendas-produtos');
    container.innerHTML = '';

    PRODUCTS.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-header">
          <div class="product-name">${_esc(p.name)}</div>
          <div class="product-price-badge">${p.price} MT</div>
        </div>
        <div class="tg">
          <div class="tg-empty"></div>
          <div class="tg-head tg-noite">🌙 Noite</div>
          <div class="tg-head tg-manha">☀️ Manhã</div>

          <div class="tg-lbl">Recebido</div>
          ${_tqty(`vn-v-${i}`)}
          ${_tqty(`vm-v-${i}`)}

          <div class="tg-lbl">Sobrou</div>
          ${_tqty(`vn-s-${i}`)}
          ${_tqty(`vm-s-${i}`)}

          <div class="tg-lbl">Danif.</div>
          ${_tqty(`vn-d-${i}`)}
          ${_tqty(`vm-d-${i}`)}
        </div>
        <div class="tg pt-turno-row">
          <div class="tg-empty"></div>
          <div class="pt-noite" id="v-ptotal-n-${i}">🌙 0 MT</div>
          <div class="pt-manha" id="v-ptotal-m-${i}">☀️ 0 MT</div>
        </div>
        <div class="pt-geral" id="v-ptotal-${i}">Total: 0 MT</div>
      `;
      container.appendChild(card);
    });

    calcVendasTotals();
  }

  function _tqty(id) {
    return `<div class="qty-control qty-sm">
      <button class="qty-btn" onclick="App.changeQty('${id}',-1,'calcVendasTotals')">−</button>
      <input type="number" id="${id}" class="qty-input" value="0" min="0" inputmode="numeric" oninput="App.calcVendasTotals()">
      <button class="qty-btn" onclick="App.changeQty('${id}',1,'calcVendasTotals')">+</button>
    </div>`;
  }

  function _renderProdProducts() {
    const container = document.getElementById('prod-produtos');
    container.innerHTML = '';

    PRODUCTS.filter(p => !p.vendasOnly).forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-header">
          <div class="product-name">${_esc(p.name)}</div>
          <div class="product-price-badge">${p.price} MT</div>
        </div>
        <div class="prod-qty-wrap">
          <span class="prod-qty-label">Produzido</span>
          <div class="qty-control" style="max-width:200px;">
            <button class="qty-btn" onclick="App.changeQty('p-prod-${i}',-1,'calcProdTotals')">−</button>
            <input type="number" id="p-prod-${i}" class="qty-input"
                   value="0" min="0" inputmode="numeric"
                   oninput="App.calcProdTotals()">
            <button class="qty-btn" onclick="App.changeQty('p-prod-${i}',1,'calcProdTotals')">+</button>
          </div>
        </div>
        ${_ingSection(p.name, i)}
      `;
      container.appendChild(card);
    });

    calcProdTotals();
  }

  function _ingSection(productName, pIdx) {
    const ings = INGREDIENTS[productName];
    if (!ings) return '';
    const rows = ings.map((ing, j) => `
      <div class="ing-row">
        <div class="ing-label-wrap">
          <span class="ing-label">${_esc(ing.name)}</span>
        </div>
        <div class="ing-input-wrap">
          <input type="number" id="p-ing-${pIdx}-${j}" class="ing-input"
                 placeholder="0" min="0" step="0.01" inputmode="decimal">
          <span class="ing-unit">${_esc(ing.unit)}</span>
        </div>
      </div>
    `).join('');
    return `<div class="ing-section">
      <div class="ing-section-title">🧂 Ingredientes Usados</div>
      ${rows}
    </div>`;
  }

  // ─── Qty helper ───────────────────────────────────────────────

  function changeQty(inputId, delta, calcFn) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.value = Math.max(0, (parseInt(el.value) || 0) + delta);
    if (calcFn === 'calcVendasTotals') calcVendasTotals();
    else calcProdTotals();
  }

  // ─── Totals: vendas ───────────────────────────────────────────

  function calcVendasTotals() {
    let totalNoite = 0, totalManha = 0;

    PRODUCTS.forEach((p, i) => {
      const vn = _int(`vn-v-${i}`), sn = _int(`vn-s-${i}`), dn = _int(`vn-d-${i}`);
      const vm = _int(`vm-v-${i}`), sm = _int(`vm-s-${i}`), dm = _int(`vm-d-${i}`);
      const netN = Math.max(0, vn - sn - dn);
      const netM = Math.max(0, vm - sm - dm);

      const ptN = document.getElementById(`v-ptotal-n-${i}`);
      const ptM = document.getElementById(`v-ptotal-m-${i}`);
      const ptEl = document.getElementById(`v-ptotal-${i}`);
      if (ptN)  ptN.textContent  = `🌙 ${netN * p.price} MT`;
      if (ptM)  ptM.textContent  = `☀️ ${netM * p.price} MT`;
      if (ptEl) ptEl.textContent = `Total: ${(netN + netM) * p.price} MT`;

      totalNoite += netN * p.price;
      totalManha += netM * p.price;
    });

    const totalGeral  = totalNoite + totalManha;
    const totalSaidas     = Array.from(document.querySelectorAll('.saida-amt'))
      .reduce((s, el) => s + Math.max(0, parseFloat(el.value) || 0), 0);
    const totalEncomendas = Array.from(document.querySelectorAll('.encomenda-amt'))
      .reduce((s, el) => s + Math.max(0, parseFloat(el.value) || 0), 0);
    const netEntregar     = Math.max(0, totalGeral - totalSaidas) + totalEncomendas;

    const encRow = document.getElementById('tot-enc-row');
    if (encRow) encRow.style.display = totalEncomendas > 0 ? '' : 'none';
    _setText('tot-encomendas', `+ ${totalEncomendas} MT`);

    _setText('tot-noite',        `${totalNoite} MT`);
    _setText('tot-manha',        `${totalManha} MT`);
    _setText('tot-geral',        `${totalGeral} MT`);
    _setText('tot-saidas',       `− ${totalSaidas} MT`);
    _setText('tot-net-entregar', `${netEntregar} MT`);

    const recebido  = _float('dinheiro-recebido');
    const diferenca = recebido - netEntregar;
    const diffEl    = document.getElementById('tot-diferenca');
    const banner    = document.getElementById('status-banner');

    if (recebido === 0) {
      if (diffEl) diffEl.textContent = '—';
      if (banner) { banner.textContent = ''; banner.className = 'status-banner'; }
    } else {
      if (diffEl) diffEl.textContent = `${diferenca} MT`;
      if (diferenca < 0)      _setDiffStyle(banner, 'falta', '⚠️ Falta dinheiro');
      else if (diferenca > 0) _setDiffStyle(banner, 'mais',  '💰 Dinheiro a mais');
      else                    _setDiffStyle(banner, 'certo', '✅ Fecho certo');
    }

    // Distribuição check: depositado + cofre must equal recebido
    const depositado       = _float('dinheiro-depositado');
    const cofre            = _float('dinheiro-cofre');
    const totalDistribuido = depositado + cofre;
    const checkRow         = document.getElementById('distribuicao-check-row');
    const checkLabel       = document.getElementById('distribuicao-check-label');
    const checkVal         = document.getElementById('tot-distribuicao');

    if (checkVal) checkVal.textContent = `${totalDistribuido} MT`;

    if (checkRow && checkLabel) {
      if (depositado === 0 && cofre === 0) {
        checkRow.className = 'total-row distribuicao-check-row';
        checkLabel.textContent = 'Depositado + Cofre';
      } else if (totalDistribuido === recebido) {
        checkRow.className = 'total-row distribuicao-check-row distr-ok';
        checkLabel.textContent = '✅ Distribuição correta';
      } else {
        const diff = recebido - totalDistribuido;
        checkRow.className = 'total-row distribuicao-check-row distr-err';
        checkLabel.textContent = diff > 0 ? `⚠️ Falta ${diff} MT` : `⚠️ ${Math.abs(diff)} MT a mais`;
      }
    }
  }

  function _setDiffStyle(el, cls, msg) {
    if (!el) return;
    el.textContent = msg;
    el.className = `status-banner visible ${cls}`;
  }

  // ─── Totals: produção ─────────────────────────────────────────

  function calcProdTotals() {
    let total = 0;
    PRODUCTS.filter(p => !p.vendasOnly).forEach((_, i) => { total += _int(`p-prod-${i}`); });
    _setText('tot-produzido', `${total} un.`);
  }

  // ─── Submit: vendas ───────────────────────────────────────────

  function _collectVendasPayload() {
    const nome  = document.getElementById('vendas-nome').value.trim();
    const data  = document.getElementById('vendas-data').value;
    const items = PRODUCTS.map((p, i) => {
      const vn = _int(`vn-v-${i}`), sn = _int(`vn-s-${i}`), dn = _int(`vn-d-${i}`);
      const vm = _int(`vm-v-${i}`), sm = _int(`vm-s-${i}`), dm = _int(`vm-d-${i}`);
      const netN = Math.max(0, vn - sn - dn);
      const netM = Math.max(0, vm - sm - dm);
      return {
        produto: p.name, precoUnitario: p.price,
        noite: { vendido: vn, sobrou: sn, danificado: dn, netSold: netN, total: netN * p.price },
        manha: { vendido: vm, sobrou: sm, danificado: dm, netSold: netM, total: netM * p.price },
        totalProduto: (netN + netM) * p.price,
      };
    });
    const totalNoite       = items.reduce((s, x) => s + x.noite.total, 0);
    const totalManha       = items.reduce((s, x) => s + x.manha.total, 0);
    const totalGeral       = totalNoite + totalManha;
    const comentario       = (document.getElementById('vendas-comentario')?.value || '').trim();
    const saidasItems      = Array.from(document.querySelectorAll('.saida-item')).map(item => ({
      descricao: item.querySelector('.saida-desc')?.value.trim() || '',
      valor:     Math.max(0, parseFloat(item.querySelector('.saida-amt')?.value) || 0),
    })).filter(s => s.valor > 0);
    const totalSaidas      = saidasItems.reduce((s, x) => s + x.valor, 0);
    const encomendasItems  = Array.from(document.querySelectorAll('.encomenda-item')).map(item => ({
      nome:       item.querySelector('.encomenda-nome')?.value.trim() || '',
      quantidade: Math.max(0, parseInt(item.querySelector('.encomenda-qty')?.value)   || 0),
      recebido:   Math.max(0, parseFloat(item.querySelector('.encomenda-amt')?.value) || 0),
    })).filter(e => e.nome || e.quantidade || e.recebido);
    const totalEncomendas  = encomendasItems.reduce((s, x) => s + x.recebido, 0);
    const netEntregar      = Math.max(0, totalGeral - totalSaidas);
    const dinheiroRecebido = _float('dinheiro-recebido');
    return {
      reportType: 'vendas', sellerName: nome, branch: 'Padaria Principal',
      shift: 'Noite+Manhã', date: data, submittedAt: new Date().toISOString(),
      items, comentario: comentario || null, saidas: saidasItems, encomendas: encomendasItems,
      totals: {
        totalUnidsNoite: items.reduce((s, x) => s + x.noite.vendido, 0),
        totalUnidsManha: items.reduce((s, x) => s + x.manha.vendido, 0),
        totalNoite, totalManha, totalEsperado: totalGeral,
        totalSaidas, totalEncomendas, netEntregar, dinheiroRecebido,
        dinheiroDepositado: _float('dinheiro-depositado'),
        dinheiroCofre:      _float('dinheiro-cofre'),
        diferenca:          dinheiroRecebido - netEntregar,
      },
    };
  }

  let _pendingPayload = null;

  function showConfirm() {
    const nome = document.getElementById('vendas-nome').value.trim();
    const data = document.getElementById('vendas-data').value;
    if (!nome) { showToast('⚠️ Preencha o nome do vendedor'); return; }
    if (!data)  { showToast('⚠️ Preencha a data'); return; }
    _pendingPayload = _collectVendasPayload();
    _renderConfirm(_pendingPayload);
    _showScreen('screen-confirm');
  }

  function _renderConfirm(p) {
    const t      = p.totals;
    const rec    = t.dinheiroRecebido;
    const dep    = t.dinheiroDepositado;
    const cofre  = t.dinheiroCofre;
    const difCls  = t.diferenca < 0 ? 'falta' : t.diferenca > 0 ? 'mais' : 'certo';
    const difIcon = t.diferenca < 0 ? '⚠️' : t.diferenca > 0 ? '💰' : '✅';
    const difMsg  = t.diferenca < 0 ? 'Falta dinheiro' : t.diferenca > 0 ? 'Dinheiro a mais' : 'Fecho certo';
    const distrOk = (dep + cofre) === rec;

    const active = p.items.filter(x =>
      x.noite.vendido || x.manha.vendido || x.noite.sobrou ||
      x.manha.sobrou  || x.noite.danificado || x.manha.danificado
    );

    const prodHtml = active.length ? active.map(x => `
      <div class="conf-product">
        <div class="conf-product-name">${_esc(x.produto)} <span class="conf-product-price">${x.precoUnitario} MT</span></div>
        ${x.noite.vendido||x.noite.sobrou||x.noite.danificado ? `
        <div class="conf-product-row"><span>🌙 Noite</span>
          <span>Rec:${x.noite.vendido} Sob:${x.noite.sobrou} Dan:${x.noite.danificado} → <strong>${x.noite.netSold} un. · ${x.noite.total} MT</strong></span>
        </div>` : ''}
        ${x.manha.vendido||x.manha.sobrou||x.manha.danificado ? `
        <div class="conf-product-row"><span>☀️ Manhã</span>
          <span>Rec:${x.manha.vendido} Sob:${x.manha.sobrou} Dan:${x.manha.danificado} → <strong>${x.manha.netSold} un. · ${x.manha.total} MT</strong></span>
        </div>` : ''}
      </div>`).join('') :
      '<div class="conf-empty">Nenhum produto preenchido</div>';

    document.getElementById('confirm-content').innerHTML = `
      <div class="conf-card">
        <div class="conf-card-title">👤 Informação</div>
        <div class="conf-row"><span>Vendedor</span><strong>${_esc(p.sellerName)}</strong></div>
        <div class="conf-row"><span>Data</span><strong>${p.date}</strong></div>
      </div>
      <div class="conf-card">
        <div class="conf-card-title">🥖 Produtos ${active.length ? `<span class="conf-count">${active.length}</span>` : ''}</div>
        ${prodHtml}
      </div>
      ${p.saidas.length ? `
      <div class="conf-card">
        <div class="conf-card-title">💸 Saídas</div>
        ${p.saidas.map(s => `<div class="conf-row"><span>${_esc(s.descricao)||'—'}</span><strong>${s.valor} MT</strong></div>`).join('')}
        <div class="conf-row conf-subtotal"><span>Total Saídas</span><strong>${t.totalSaidas} MT</strong></div>
      </div>` : ''}
      ${p.encomendas?.length ? `
      <div class="conf-card">
        <div class="conf-card-title">📦 Encomendas</div>
        ${p.encomendas.map(e => `
          <div class="conf-row">
            <span>${_esc(e.nome)||'—'} ${e.quantidade ? `<span style="color:#888;font-size:13px">(${e.quantidade} un.)</span>` : ''}</span>
            <strong>${e.recebido} MT</strong>
          </div>`).join('')}
        <div class="conf-row conf-subtotal"><span>Total Encomendas</span><strong>${t.totalEncomendas} MT</strong></div>
      </div>` : ''}
      <div class="conf-card">
        <div class="conf-card-title">💰 Financeiro</div>
        <div class="conf-row"><span>🌙 Total Noite</span><strong>${t.totalNoite} MT</strong></div>
        <div class="conf-row"><span>☀️ Total Manhã</span><strong>${t.totalManha} MT</strong></div>
        <div class="conf-row"><span>Total Geral</span><strong>${t.totalEsperado} MT</strong></div>
        ${t.totalSaidas ? `<div class="conf-row"><span>Saídas</span><strong style="color:var(--red)">− ${t.totalSaidas} MT</strong></div>` : ''}
        <div class="conf-row conf-highlight"><span>Net a Entregar</span><strong>${t.netEntregar} MT</strong></div>
        <div class="conf-row"><span>Dinheiro Recebido</span><strong>${rec} MT</strong></div>
        ${rec ? `<div class="conf-status ${difCls}">${difIcon} ${difMsg}</div>` : ''}
      </div>
      ${dep||cofre ? `
      <div class="conf-card">
        <div class="conf-card-title">🏦 Distribuição</div>
        <div class="conf-row"><span>🏦 Depositado</span><strong>${dep} MT</strong></div>
        <div class="conf-row"><span>🔒 No Cofre</span><strong>${cofre} MT</strong></div>
        <div class="conf-status ${distrOk?'certo':'falta'}">${distrOk?'✅ Distribuição correta':'⚠️ Depositado + Cofre ≠ Dinheiro Recebido'}</div>
      </div>` : ''}
      ${p.comentario ? `
      <div class="conf-card">
        <div class="conf-card-title">💬 Comentário</div>
        <div class="conf-comment">${_esc(p.comentario)}</div>
      </div>` : ''}
    `;
  }

  async function confirmAndSubmit() {
    if (!_pendingPayload) return;
    _pendingPayload.submittedAt = new Date().toISOString();
    await _submit(_pendingPayload, 'confirm-submit-btn');
  }

  function backToVendas() {
    _showScreen('screen-vendas');
  }

  async function submitVendas() {
    const nome = document.getElementById('vendas-nome').value.trim();
    const data = document.getElementById('vendas-data').value;
    if (!nome) { showToast('⚠️ Preencha o nome do vendedor'); return; }
    if (!data)  { showToast('⚠️ Preencha a data'); return; }
    await _submit(_collectVendasPayload(), 'vendas-submit-btn');
  }

  // ─── Submit: produção ─────────────────────────────────────────

  async function submitProducao() {
    const nome   = document.getElementById('prod-nome').value.trim();
    const data   = document.getElementById('prod-data').value;
    const filial = 'Padaria Principal';

    if (!nome) { showToast('⚠️ Preencha o nome do trabalhador'); return; }
    if (!data) { showToast('⚠️ Preencha a data'); return; }

    const items = PRODUCTS.filter(p => !p.vendasOnly).map((p, i) => {
      const ings = INGREDIENTS[p.name];
      const ingredientes = ings
        ? ings.map((ing, j) => ({
            nome:       ing.name,
            unidade:    ing.unit,
            quantidade: parseFloat(document.getElementById(`p-ing-${i}-${j}`)?.value) || 0,
          })).filter(x => x.quantidade > 0)
        : [];
      return {
        produto:       p.name,
        precoUnitario: p.price,
        produzido:     _int(`p-prod-${i}`),
        ...(ingredientes.length ? { ingredientes } : {}),
      };
    });

    const totalProduzido = items.reduce((s, x) => s + x.produzido, 0);

    const comentario = (document.getElementById('prod-comentario')?.value || '').trim();

    const payload = {
      reportType:  'producao',
      workerName:  nome,
      branch:      filial,
      shift:       prodShift,
      date:        data,
      submittedAt: new Date().toISOString(),
      items,
      comentario:  comentario || null,
      totals: { totalProduzido },
    };

    await _submit(payload, 'prod-submit-btn');
  }

  // ─── Generic submit ───────────────────────────────────────────

  async function _submit(payload, btnId) {
    const btn = document.getElementById(btnId);
    if (btn) { btn.disabled = true; btn.textContent = '⏳ A enviar...'; }

    try {
      const res  = await fetch('/api/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        _saveLocal(payload);
        showToast('✅ Submetido com sucesso!');
        setTimeout(logout, 1600);
      } else {
        showToast('❌ Erro ao enviar. Tente outra vez.');
        if (btn) { btn.disabled = false; btn.textContent = '✅ Submeter'; }
      }
    } catch {
      showToast('❌ Sem ligação. Verifique a rede.');
      if (btn) { btn.disabled = false; btn.textContent = '✅ Submeter'; }
    }
  }

  // ─── Saídas ───────────────────────────────────────────────────

  let _saidaCount = 0;

  function addSaida() {
    _saidaCount++;
    const id   = _saidaCount;
    const list = document.getElementById('saidas-list');
    const item = document.createElement('div');
    item.className = 'saida-item';
    item.id = `saida-${id}`;
    item.innerHTML = `
      <input type="text" class="saida-desc big-input" placeholder="Descrição da saída..." autocomplete="off">
      <div class="saida-amt-wrap">
        <input type="number" class="saida-amt" id="saida-amt-${id}"
               placeholder="0" min="0" inputmode="decimal"
               oninput="App.calcVendasTotals()">
        <span class="saida-mt-label">MT</span>
      </div>
      <button class="saida-remove-btn" onclick="App.removeSaida(${id})">✕</button>
    `;
    list.appendChild(item);
    item.querySelector('.saida-desc').focus();
    calcVendasTotals();
  }

  function removeSaida(id) {
    const el = document.getElementById(`saida-${id}`);
    if (el) el.remove();
    calcVendasTotals();
  }

  // ─── Encomendas ───────────────────────────────────────────────

  let _encCount = 0;

  function addEncomenda() {
    _encCount++;
    const id   = _encCount;
    const list = document.getElementById('encomendas-list');
    const item = document.createElement('div');
    item.className = 'encomenda-item';
    item.id = `encomenda-${id}`;
    item.innerHTML = `
      <div class="encomenda-top-row">
        <input type="text" class="encomenda-nome big-input" placeholder="Nome da encomenda..." autocomplete="off">
        <button class="saida-remove-btn" onclick="App.removeEncomenda(${id})">✕</button>
      </div>
      <div class="encomenda-bottom-row">
        <div class="encomenda-field">
          <span class="encomenda-field-lbl">Quantidade</span>
          <div class="encomenda-input-row">
            <input type="number" class="encomenda-qty" placeholder="0" min="0" inputmode="numeric" oninput="App.calcVendasTotals()">
            <span class="encomenda-unit">un.</span>
          </div>
        </div>
        <div class="encomenda-field">
          <span class="encomenda-field-lbl">Recebido</span>
          <div class="encomenda-input-row">
            <input type="number" class="encomenda-amt" placeholder="0" min="0" inputmode="decimal" oninput="App.calcVendasTotals()">
            <span class="encomenda-unit">MT</span>
          </div>
        </div>
      </div>
    `;
    list.appendChild(item);
    item.querySelector('.encomenda-nome').focus();
  }

  function removeEncomenda(id) {
    const el = document.getElementById(`encomenda-${id}`);
    if (el) el.remove();
    calcVendasTotals();
  }

  // ─── Fecho de Caixa ──────────────────────────────────────────

  let _fechoRecords = [];

  function goToFecho() {
    _fechoRecords = [];
    document.getElementById('fecho-nome').value  = '';
    document.getElementById('fecho-data').value  = _today();
    document.getElementById('fecho-found-shifts').innerHTML = '';
    document.getElementById('fecho-payment-section').style.display = 'none';
    _showScreen('screen-fecho');
  }

  function searchFechoRecords() {
    const nome = document.getElementById('fecho-nome').value.trim();
    const data = document.getElementById('fecho-data').value;
    if (!nome) { showToast('⚠️ Preencha o nome do vendedor'); return; }
    if (!data) { showToast('⚠️ Preencha a data');            return; }

    const all = _loadLocal();
    _fechoRecords = all.filter(r =>
      r.reportType === 'vendas' &&
      (r.sellerName || '').trim().toLowerCase() === nome.toLowerCase() &&
      r.date === data
    );

    const shiftsEl   = document.getElementById('fecho-found-shifts');
    const paySection = document.getElementById('fecho-payment-section');

    if (_fechoRecords.length === 0) {
      shiftsEl.innerHTML = `<div class="fecho-empty">Nenhum registo de vendas encontrado para <strong>${_esc(nome)}</strong> em ${data}.</div>`;
      paySection.style.display = 'none';
      return;
    }

    // Render per-shift cards
    shiftsEl.innerHTML = _fechoRecords.map(r => {
      const icon = r.shift === 'Noite' ? '🌙' : '☀️';
      return `<div class="fecho-shift-card">
        <div class="fecho-shift-title">${icon} Turno da ${r.shift}</div>
        <div class="fecho-shift-stats">
          Vendido: <strong>${r.totals?.totalVendido||0} un.</strong> &nbsp;·&nbsp;
          Sobras: <strong>${r.totals?.totalSobras||0} un.</strong> &nbsp;·&nbsp;
          Esperado: <strong>${r.totals?.totalEsperado||0} MT</strong>
        </div>
      </div>`;
    }).join('');

    // Breakdown rows inside totals panel
    const breakdownHtml = _fechoRecords.map(r => {
      const icon = r.shift === 'Noite' ? '🌙' : '☀️';
      return `<div class="total-row">
        <span class="total-row-label">${icon} Turno da ${r.shift}</span>
        <span class="total-row-value">${r.totals?.totalEsperado||0} MT</span>
      </div>`;
    }).join('');
    document.getElementById('fecho-shift-breakdown').innerHTML = breakdownHtml;

    const combinedEsp = _fechoRecords.reduce((s, r) => s + (r.totals?.totalEsperado||0), 0);
    document.getElementById('fecho-total-esp').textContent = `${combinedEsp} MT`;
    document.getElementById('fecho-recebido').value = '';
    document.getElementById('fecho-diferenca').textContent = '—';
    const b = document.getElementById('fecho-status-banner');
    b.textContent = ''; b.className = 'status-banner';

    paySection.style.display = 'block';
    paySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function calcFechoTotals() {
    const combinedEsp = _fechoRecords.reduce((s, r) => s + (r.totals?.totalEsperado||0), 0);
    const recebido    = _float('fecho-recebido');
    const diff        = recebido - combinedEsp;
    const diffEl      = document.getElementById('fecho-diferenca');
    const banner      = document.getElementById('fecho-status-banner');

    if (recebido === 0) {
      if (diffEl)  diffEl.textContent = '—';
      if (banner) { banner.textContent = ''; banner.className = 'status-banner'; }
      return;
    }

    if (diffEl) diffEl.textContent = `${diff} MT`;
    if (diff < 0)       _setDiffStyle(banner, 'falta', '⚠️ Falta dinheiro');
    else if (diff > 0)  _setDiffStyle(banner, 'mais',  '💰 Dinheiro a mais');
    else                _setDiffStyle(banner, 'certo', '✅ Fecho certo');
  }

  async function submitFecho() {
    const nome     = document.getElementById('fecho-nome').value.trim();
    const data     = document.getElementById('fecho-data').value;
    const recebido = _float('fecho-recebido');

    if (_fechoRecords.length === 0) { showToast('⚠️ Procure os registos primeiro'); return; }
    if (recebido === 0)             { showToast('⚠️ Preencha o dinheiro recebido'); return; }

    const combinedEsp  = _fechoRecords.reduce((s, r) => s + (r.totals?.totalEsperado||0),    0);
    const combinedVend = _fechoRecords.reduce((s, r) => s + (r.totals?.totalVendido||0),     0);
    const combinedSob  = _fechoRecords.reduce((s, r) => s + (r.totals?.totalSobras||0),      0);
    const combinedDani = _fechoRecords.reduce((s, r) => s + (r.totals?.totalDanificado||0),  0);

    const payload = {
      reportType:     'fecho',
      sellerName:     nome,
      branch:         'Padaria Principal',
      date:           data,
      submittedAt:    new Date().toISOString(),
      shiftsIncluded: _fechoRecords.map(r => r.shift),
      totals: {
        totalVendido:     combinedVend,
        totalSobras:      combinedSob,
        totalDanificado:  combinedDani,
        totalEsperado:    combinedEsp,
        dinheiroRecebido: recebido,
        diferenca:        recebido - combinedEsp,
      },
    };

    await _submit(payload, 'fecho-submit-btn');
  }

  // ─── Local storage ────────────────────────────────────────────

  const LS_KEY = 'padaria_reports_v1';

  function _saveLocal(payload) {
    const list = _loadLocal();
    list.push(payload);
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
  }

  function _loadLocal() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  }

  function clearResumo() {
    if (!confirm('Apagar todos os registos locais?')) return;
    try { localStorage.removeItem(LS_KEY); } catch {}
    _renderResumo();
  }

  // ─── Resumo (admin panel) ─────────────────────────────────────

  function _renderResumo() {
    const container = document.getElementById('resumo-content');
    const reports   = _loadLocal();
    container.innerHTML = '';

    if (reports.length === 0) {
      container.innerHTML = '<div class="resumo-empty">📭 Nenhum registo encontrado</div>';
      return;
    }

    const vendas = reports.filter(r => r.reportType === 'vendas');
    const prod   = reports.filter(r => r.reportType === 'producao');

    container.appendChild(_rSection('📊 Resumo Geral',               _rSummary(vendas, prod)));
    container.appendChild(_rSection('🔍 Análise por Produto',        _rProducts(vendas, prod)));
    if (vendas.length > 0)
      container.appendChild(_rSection('💰 Análise por Vendedor',     _rFinancial(vendas)));
    if (prod.length > 0)
      container.appendChild(_rSection('🧂 Ingredientes Usados',      _rIngredients(prod)));
    container.appendChild(_rSection('📋 Todos os Registos',          _rAllRecords(reports)));
  }

  function _rSection(title, html) {
    const el = document.createElement('div');
    el.className = 'admin-section';
    el.innerHTML = `<div class="admin-section-title">${title}</div>${html}`;
    return el;
  }

  // Section 1 — overall summary stats
  function _rSummary(vendas, prod) {
    const tv = (r, k) => r.totals?.[k] || 0;
    const totalProd    = prod.reduce((s, r)   => s + tv(r, 'totalProduzido'), 0);
    const totalVend    = vendas.reduce((s, r) => s + _sumItemField(r, 'vendido'), 0);
    const totalSobras  = vendas.reduce((s, r) => s + _sumItemField(r, 'sobrou'), 0);
    const totalDani    = vendas.reduce((s, r) => s + _sumItemField(r, 'danificado'), 0);
    const totalEsp     = vendas.reduce((s, r) => s + tv(r, 'totalEsperado'), 0);
    const totalSaidas  = vendas.reduce((s, r) => s + tv(r, 'totalSaidas'), 0);
    const netEntregar  = vendas.reduce((s, r) => s + tv(r, 'netEntregar'), 0);
    const totalRec     = vendas.reduce((s, r) => s + tv(r, 'dinheiroRecebido'), 0);
    const totalDep     = vendas.reduce((s, r) => s + tv(r, 'dinheiroDepositado'), 0);
    const totalCofre   = vendas.reduce((s, r) => s + tv(r, 'dinheiroCofre'), 0);
    const totalDiff    = vendas.reduce((s, r) => s + tv(r, 'diferenca'), 0);
    const diffCls      = totalDiff < 0 ? 'stat-red' : totalDiff > 0 ? 'stat-orange' : 'stat-green';

    return `
      <div class="stats-grid">
        <div class="stat-card"><span class="stat-val">${prod.length + vendas.length}</span><span class="stat-lbl">Registos</span></div>
        <div class="stat-card"><span class="stat-val">${totalProd}</span><span class="stat-lbl">Produzido</span></div>
        <div class="stat-card"><span class="stat-val">${totalVend}</span><span class="stat-lbl">Recebido p/ Venda</span></div>
        <div class="stat-card"><span class="stat-val">${totalSobras}</span><span class="stat-lbl">Sobras</span></div>
        <div class="stat-card"><span class="stat-val">${totalDani}</span><span class="stat-lbl">Danificado</span></div>
        <div class="stat-card stat-yellow"><span class="stat-val">${totalEsp} MT</span><span class="stat-lbl">Total Geral Vendas</span></div>
        <div class="stat-card"><span class="stat-val">${totalSaidas} MT</span><span class="stat-lbl">Total Saídas</span></div>
        <div class="stat-card stat-yellow"><span class="stat-val">${netEntregar} MT</span><span class="stat-lbl">Net a Entregar</span></div>
        <div class="stat-card stat-yellow"><span class="stat-val">${totalRec} MT</span><span class="stat-lbl">Dinheiro Recebido</span></div>
        <div class="stat-card"><span class="stat-val">${totalDep} MT</span><span class="stat-lbl">🏦 Depositado</span></div>
        <div class="stat-card"><span class="stat-val">${totalCofre} MT</span><span class="stat-lbl">🔒 No Cofre</span></div>
        <div class="stat-card ${diffCls} stat-full"><span class="stat-val">${totalDiff >= 0 ? '+' : ''}${totalDiff} MT</span><span class="stat-lbl">${totalDiff < 0 ? '⚠️ Falta dinheiro' : totalDiff > 0 ? '💰 Dinheiro a mais' : '✅ Contas certas'}</span></div>
      </div>`;
  }

  // Section 2 — per-product production vs sales analysis
  function _rProducts(vendas, prod) {
    const prodMap = {};
    prod.forEach(r => (r.items || []).forEach(item => {
      prodMap[item.produto] = (prodMap[item.produto] || 0) + (item.produzido || 0);
    }));

    // Merge Magueva into Pão Normal for production comparison
    const salesMap = {};
    vendas.forEach(r => (r.items || []).forEach(item => {
      const key = item.produto === 'Magueva' ? 'Pão Normal' : item.produto;
      if (!salesMap[key]) salesMap[key] = { vendido: 0, sobrou: 0, danificado: 0, hasMagueva: false };

      // Handle all record formats
      let vendido, sobrou, danificado;
      if (item.noite !== undefined) {
        vendido    = (item.noite.vendido||0)    + (item.manha.vendido||0);
        sobrou     = (item.noite.sobrou||0)     + (item.manha.sobrou||0);
        danificado = (item.noite.danificado||0) + (item.manha.danificado||0);
      } else if (item.quantidadeNoite !== undefined) {
        vendido = (item.quantidadeNoite||0) + (item.quantidadeManha||0);
        sobrou = 0; danificado = 0;
      } else {
        vendido    = item.vendido    || 0;
        sobrou     = item.sobrou     || 0;
        danificado = item.danificado || 0;
      }

      salesMap[key].vendido    += vendido;
      salesMap[key].sobrou     += sobrou;
      salesMap[key].danificado += danificado;
      if (item.produto === 'Magueva') salesMap[key].hasMagueva = true;
    }));

    const allKeys = [...new Set([...Object.keys(prodMap), ...Object.keys(salesMap)])];
    const rows = allKeys
      .map(produto => {
        const p = prodMap[produto] || 0;
        const s = salesMap[produto] || { vendido: 0, sobrou: 0, danificado: 0, hasMagueva: false };
        const net = Math.max(0, s.vendido - s.sobrou - s.danificado);
        const bal = p - s.vendido; // positive = unaccounted stock; negative = data error
        return { produto, produzido: p, vendido: s.vendido, sobrou: s.sobrou, danificado: s.danificado, net, bal, hasMagueva: s.hasMagueva };
      })
      .filter(r => r.produzido > 0 || r.vendido > 0)
      .sort((a, b) => (a.bal < 0 ? -1 : b.bal < 0 ? 1 : 0) || a.produto.localeCompare(b.produto));

    if (!rows.length) return '<div class="resumo-empty" style="padding:16px">Sem dados de produção ou vendas</div>';

    return rows.map(row => {
      const cls  = row.bal < 0 ? 'anl-red' : (row.bal > 0 && row.produzido > 0) ? 'anl-orange' : 'anl-ok';
      const icon = row.bal < 0 ? '❌' : (row.bal > 0 && row.produzido > 0) ? '⚠️' : '✅';
      const msg  = row.bal < 0
        ? `❌ Vendido ${Math.abs(row.bal)} un. a mais do que produzido — verifique os dados!`
        : (row.bal > 0 && row.produzido > 0)
        ? `⚠️ ${row.bal} un. produzidas ainda não contabilizadas em vendas`
        : row.produzido === 0
        ? `ℹ️ Sem registo de produção para este produto`
        : `✅ Produção e vendas correspondem`;

      return `
        <div class="anl-card ${cls}">
          <div class="anl-header">
            <span class="anl-name">${_esc(row.produto)}</span>
            ${row.hasMagueva ? '<span class="anl-tag">+ Magueva</span>' : ''}
            <span class="anl-icon">${icon}</span>
          </div>
          <div class="anl-grid">
            <div class="anl-cell"><span class="anl-val">${row.produzido}</span><span class="anl-lbl">Produzido</span></div>
            <div class="anl-cell"><span class="anl-val">${row.vendido}</span><span class="anl-lbl">p/ Venda</span></div>
            <div class="anl-cell"><span class="anl-val">${row.net}</span><span class="anl-lbl">Net Vendido</span></div>
            <div class="anl-cell"><span class="anl-val">${row.sobrou}</span><span class="anl-lbl">Sobras</span></div>
            <div class="anl-cell"><span class="anl-val">${row.danificado}</span><span class="anl-lbl">Danificado</span></div>
            <div class="anl-cell anl-bal ${cls}"><span class="anl-val">${row.bal >= 0 ? '+' : ''}${row.bal}</span><span class="anl-lbl">Saldo</span></div>
          </div>
          <div class="anl-msg ${cls}">${msg}</div>
        </div>`;
    }).join('');
  }

  // Section 3 — financial per seller
  function _rFinancial(vendas) {
    const map = {};
    vendas.forEach(r => {
      const k = r.sellerName || 'Desconhecido';
      if (!map[k]) map[k] = { sessions: 0, geral: 0, saidas: 0, net: 0, rec: 0, dep: 0, cofre: 0, diff: 0 };
      map[k].sessions++;
      map[k].geral  += r.totals?.totalEsperado      || 0;
      map[k].saidas += r.totals?.totalSaidas         || 0;
      map[k].net    += r.totals?.netEntregar         || 0;
      map[k].rec    += r.totals?.dinheiroRecebido    || 0;
      map[k].dep    += r.totals?.dinheiroDepositado  || 0;
      map[k].cofre  += r.totals?.dinheiroCofre       || 0;
      map[k].diff   += r.totals?.diferenca           || 0;
    });

    if (!Object.keys(map).length)
      return '<div class="resumo-empty" style="padding:16px">Sem dados financeiros</div>';

    return Object.entries(map).map(([nome, d]) => {
      const cls     = d.diff < 0 ? 'falta' : d.diff > 0 ? 'mais' : 'certo';
      const diffIcon = d.diff < 0 ? '⚠️' : d.diff > 0 ? '💰' : '✅';
      const distrSum = d.dep + d.cofre;
      const distrOk  = distrSum > 0 && distrSum === d.rec;
      return `
        <div class="fin-seller-card">
          <div class="fin-seller-header">
            <span class="fin-name">${_esc(nome)}</span>
            <span class="fin-badge fin-badge--${cls}">${diffIcon} ${d.diff >= 0 ? '+' : ''}${d.diff} MT</span>
          </div>
          <div class="fin-seller-body">
            <div class="fin-dr"><span>Sessões</span><span>${d.sessions}</span></div>
            <div class="fin-dr"><span>Total Geral</span><span>${d.geral} MT</span></div>
            ${d.saidas ? `<div class="fin-dr fin-dr--neg"><span>💸 Saídas</span><span>− ${d.saidas} MT</span></div>` : ''}
            <div class="fin-dr fin-dr--hl"><span>Net a Entregar</span><span>${d.net} MT</span></div>
            <div class="fin-dr"><span>💵 Dinheiro Recebido</span><span>${d.rec} MT</span></div>
            ${d.dep || d.cofre ? `
            <div class="fin-dr"><span>🏦 Depositado</span><span>${d.dep} MT</span></div>
            <div class="fin-dr"><span>🔒 No Cofre</span><span>${d.cofre} MT</span></div>
            <div class="fin-dr ${distrOk ? 'fin-dr--ok' : distrSum > 0 ? 'fin-dr--err' : ''}">
              <span>Dep + Cofre</span>
              <span>${distrSum} MT ${distrOk ? '✅' : distrSum > 0 ? '⚠️' : ''}</span>
            </div>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  // Section 4 — ingredient totals across all production
  function _rIngredients(prod) {
    const map = {};
    prod.forEach(r => {
      (r.items || []).forEach(item => {
        (item.ingredientes || []).forEach(ing => {
          const key = `${ing.nome}||${ing.unidade}`;
          if (!map[key]) map[key] = { nome: ing.nome, unidade: ing.unidade, total: 0 };
          map[key].total += ing.quantidade;
        });
      });
    });

    const entries = Object.values(map).sort((a, b) => a.nome.localeCompare(b.nome));
    if (!entries.length)
      return '<div class="resumo-empty" style="padding:16px">Sem registos de ingredientes ainda</div>';

    return `<div class="ing-summary-list">${entries.map(e =>
      `<div class="ing-summary-row">
        <span class="ing-summary-name">${_esc(e.nome)}</span>
        <span class="ing-summary-val"><strong>${_fmt(e.total)}</strong> ${_esc(e.unidade)}</span>
      </div>`
    ).join('')}</div>`;
  }

  // Section 5 — all records detailed
  function _rAllRecords(reports) {
    const groups = [
      { title: '🛒 Vendas',          fn: r => r.reportType === 'vendas'   },
      { title: '🌙 Produção Noite',  fn: r => r.reportType === 'producao' && r.shift === 'Noite' },
      { title: '☀️ Produção Manhã',  fn: r => r.reportType === 'producao' && r.shift === 'Manhã' },
    ];

    return groups.map(g => {
      const recs = reports.filter(g.fn);
      if (!recs.length) return '';

      const cards = recs.slice().reverse().map(r => {
        const isV  = r.reportType === 'vendas';
        const nome = isV ? r.sellerName : r.workerName;

        if (!isV) {
          const active = (r.items || []).filter(x => x.produzido > 0);
          const rows = active.map(x => {
            const ingHtml = (x.ingredientes || []).length
              ? `<div class="rec-ing-list">${x.ingredientes.map(ing =>
                  `<span class="rec-ing-item">${_esc(ing.nome)}: <strong>${_fmt(ing.quantidade)} ${_esc(ing.unidade)}</strong></span>`
                ).join('')}</div>`
              : '';
            return `<div class="rec-item"><span>${_esc(x.produto)}</span><span class="rec-vals"><strong>${x.produzido}</strong> un.</span></div>${ingHtml}`;
          }).join('');
          return `<div class="rec-card">
            <div class="rec-header"><span class="rec-name">${_esc(nome)}</span><span class="rec-date">${r.date}</span></div>
            <div class="rec-items">${rows || '<span style="color:#bbb;font-size:13px">Sem entradas</span>'}</div>
            <div class="rec-footer"><span>Total: <strong>${r.totals?.totalProduzido||0} un.</strong></span></div>
            ${r.comentario ? `<div class="rec-comentario">💬 ${_esc(r.comentario)}</div>` : ''}
          </div>`;
        }

        // ── Vendas record ──
        const active = (r.items || []).filter(x => {
          if (x.noite !== undefined)
            return x.noite.vendido||x.noite.sobrou||x.noite.danificado||x.manha.vendido||x.manha.sobrou||x.manha.danificado;
          return x.vendido||x.sobrou||x.danificado;
        });

        const itemRows = active.map(x => {
          if (x.noite !== undefined) {
            const rows = [];
            if (x.noite.vendido||x.noite.sobrou||x.noite.danificado)
              rows.push(`<div class="rec-item rec-item--shift">
                <span>${_esc(x.produto)} <span class="rec-shift-lbl">🌙</span></span>
                <span class="rec-vals">▶${x.noite.vendido} ↩${x.noite.sobrou} ✕${x.noite.danificado} → <strong>${x.noite.netSold}</strong> un. · ${x.noite.total} MT</span>
              </div>`);
            if (x.manha.vendido||x.manha.sobrou||x.manha.danificado)
              rows.push(`<div class="rec-item rec-item--shift">
                <span>${_esc(x.produto)} <span class="rec-shift-lbl">☀️</span></span>
                <span class="rec-vals">▶${x.manha.vendido} ↩${x.manha.sobrou} ✕${x.manha.danificado} → <strong>${x.manha.netSold}</strong> un. · ${x.manha.total} MT</span>
              </div>`);
            return rows.join('');
          }
          const net = Math.max(0, (x.vendido||0) - (x.sobrou||0) - (x.danificado||0));
          return `<div class="rec-item"><span>${_esc(x.produto)}</span>
            <span class="rec-vals">▶${x.vendido||0} ↩${x.sobrou||0} ✕${x.danificado||0} → <strong>${net}</strong> un. · ${x.totalEsperadoProduto||x.totalProduto||0} MT</span></div>`;
        }).join('');

        const saidas = r.saidas || [];
        const saidasHtml = saidas.length ? `
          <div class="rec-saidas-title">💸 Saídas</div>
          ${saidas.map(s => `<div class="rec-item"><span>${_esc(s.descricao)||'—'}</span><span class="rec-vals" style="color:var(--red)">${s.valor} MT</span></div>`).join('')}
        ` : '';
        const encomendas = r.encomendas || [];
        const encomendasHtml = encomendas.length ? `
          <div class="rec-saidas-title">📦 Encomendas</div>
          ${encomendas.map(e => `<div class="rec-item"><span>${_esc(e.nome)||'—'} ${e.quantidade ? `<span style="color:#888;font-size:12px">(${e.quantidade} un.)</span>` : ''}</span><span class="rec-vals">${e.recebido} MT</span></div>`).join('')}
        ` : '';

        const t    = r.totals || {};
        const diff = t.diferenca || 0;
        const cls  = diff < 0 ? 'falta' : diff > 0 ? 'mais' : 'certo';
        const dep  = t.dinheiroDepositado || 0;
        const cofre = t.dinheiroCofre || 0;

        return `<div class="rec-card">
          <div class="rec-header">
            <span class="rec-name">${_esc(nome)}</span>
            <span class="rec-date">${r.date}</span>
          </div>
          <div class="rec-items">
            ${itemRows || '<span style="color:#bbb;font-size:13px">Sem entradas</span>'}
            ${saidasHtml}
            ${encomendasHtml}
          </div>
          <div class="rec-financials">
            <div class="rec-fin-row"><span>Total Geral</span><span>${t.totalEsperado||0} MT</span></div>
            ${t.totalSaidas ? `<div class="rec-fin-row rec-fin-row--neg"><span>Saídas</span><span>− ${t.totalSaidas} MT</span></div>` : ''}
            <div class="rec-fin-row rec-fin-row--hl"><span>Net a Entregar</span><span>${t.netEntregar||t.totalEsperado||0} MT</span></div>
            <div class="rec-fin-row"><span>Dinheiro Recebido</span><span>${t.dinheiroRecebido||0} MT</span></div>
            <div class="rec-fin-row rec-fin-row--${cls}"><span>${diff < 0 ? '⚠️ Falta dinheiro' : diff > 0 ? '💰 Dinheiro a mais' : '✅ Contas certas'}</span><span>${diff >= 0 ? '+' : ''}${diff} MT</span></div>
            ${dep||cofre ? `
            <div class="rec-fin-row"><span>🏦 Depositado</span><span>${dep} MT</span></div>
            <div class="rec-fin-row"><span>🔒 No Cofre</span><span>${cofre} MT</span></div>` : ''}
          </div>
          ${r.comentario ? `<div class="rec-comentario">💬 ${_esc(r.comentario)}</div>` : ''}
        </div>`;
      }).join('');

      return `<div class="rec-group-title">${g.title} <span class="rec-count">${recs.length}</span></div>${cards}`;
    }).join('');
  }

  function _sumField(record, field) {
    return (record.items || []).reduce((s, x) => s + (x[field] || 0), 0);
  }

  function _sumItemField(record, field) {
    return (record.items || []).reduce((s, x) => {
      if (x.noite !== undefined) return s + (x.noite[field]||0) + (x.manha[field]||0);
      return s + (x[field] || 0);
    }, 0);
  }

  // ─── Toast ────────────────────────────────────────────────────

  let _toastTimer = null;

  function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
  }

  // ─── Helpers ──────────────────────────────────────────────────

  function _int(id)   { return Math.max(0, parseInt(document.getElementById(id)?.value) || 0); }
  function _float(id) { return Math.max(0, parseFloat(document.getElementById(id)?.value) || 0); }
  function _setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
  function _esc(s)    { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function _fmt(n)    { return Number.isInteger(n) ? n : parseFloat(n.toFixed(2)); }

  // ─── PIN ──────────────────────────────────────────────────────

  function _goToRoleScreen(role) {
    if (role === 'producao') {
      goToShiftPick('producao');
    } else if (role === 'resumo') {
      goTo('resumo', null);
    } else if (role === 'admin') {
      _renderAdminResumo();
      _renderStock();
      _showScreen('screen-admin');
    } else {
      goTo('vendas', null); // 'vendas' or any unrecognised role
    }
  }

  // ─── Admin ────────────────────────────────────────────────────

  function switchAdminTab(tab, btn) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('admin-tab--active'));
    document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('admin-tab-panel--active'));
    btn.classList.add('admin-tab--active');
    document.getElementById(`admin-tab-${tab}`).classList.add('admin-tab-panel--active');
    if (tab === 'resumo') _renderAdminResumo();
    if (tab === 'stock')  _renderStock();
  }

  function _renderAdminResumo() {
    const container = document.getElementById('admin-resumo-content');
    if (!container) return;
    const reports = _loadLocal();
    container.innerHTML = '';
    if (reports.length === 0) {
      container.innerHTML = '<div class="resumo-empty">📭 Nenhum registo encontrado</div>';
      return;
    }
    const vendas = reports.filter(r => r.reportType === 'vendas');
    const prod   = reports.filter(r => r.reportType === 'producao');
    container.appendChild(_rSection('📊 Resumo Geral',        _rSummary(vendas, prod)));
    container.appendChild(_rSection('🔍 Análise por Produto', _rProducts(vendas, prod)));
    if (vendas.length > 0)
      container.appendChild(_rSection('💰 Análise por Vendedor', _rFinancial(vendas)));
    if (prod.length > 0)
      container.appendChild(_rSection('🧂 Ingredientes Usados',  _rIngredients(prod)));
    container.appendChild(_rSection('📋 Todos os Registos',   _rAllRecords(reports)));
  }

  // ─── Stock ────────────────────────────────────────────────────

  const STOCK_KEY = 'padaria_stock_v1';

  function _getStockItems() {
    const seen = new Set();
    const list = [];
    Object.values(INGREDIENTS).forEach(ings => {
      ings.forEach(ing => {
        const key = `${ing.name}||${ing.unit}`;
        if (!seen.has(key)) {
          seen.add(key);
          list.push({ name: ing.name, unit: ing.unit, key });
        }
      });
    });
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }

  function _loadStock() {
    try { return JSON.parse(localStorage.getItem(STOCK_KEY) || '{}'); } catch { return {}; }
  }

  function _saveStockData(data) {
    try { localStorage.setItem(STOCK_KEY, JSON.stringify(data)); } catch {}
  }

  function _renderStock() {
    const container = document.getElementById('admin-stock-content');
    if (!container) return;

    const items   = _getStockItems();
    const stock   = _loadStock();
    const reports = _loadLocal();
    const prod    = reports.filter(r => r.reportType === 'producao');

    const usedMap = {};
    prod.forEach(r => {
      (r.items || []).forEach(item => {
        (item.ingredientes || []).forEach(ing => {
          const key = `${ing.nome}||${ing.unidade}`;
          usedMap[key] = (usedMap[key] || 0) + ing.quantidade;
        });
      });
    });

    const lastSaved = Object.values(stock).reduce((latest, v) => {
      if (!v.savedAt) return latest;
      return (!latest || v.savedAt > latest) ? v.savedAt : latest;
    }, null);

    const lastSavedStr = lastSaved
      ? new Date(lastSaved).toLocaleString('pt-PT')
      : 'Nunca guardado';

    container.innerHTML = `
      <div class="stock-meta">🕐 Última atualização: <strong>${lastSavedStr}</strong></div>
      <div class="stock-cards">
        ${items.map(item => {
          const saved = stock[item.key];
          const qty   = saved?.qty != null ? saved.qty : '';
          const notes = saved?.notes ? _esc(saved.notes) : '';
          const used  = usedMap[item.key] || 0;
          const saldo = qty !== '' ? parseFloat(qty) - used : null;
          const saldoHtml = saldo === null
            ? `<div class="stock-saldo stock-saldo--none">Insira o stock para ver o saldo</div>`
            : saldo > 0
            ? `<div class="stock-saldo stock-saldo--pos">✅ +${_fmt(saldo)} ${_esc(item.unit)} disponível</div>`
            : saldo < 0
            ? `<div class="stock-saldo stock-saldo--neg">⚠️ ${_fmt(Math.abs(saldo))} ${_esc(item.unit)} em falta</div>`
            : `<div class="stock-saldo stock-saldo--zero">✅ Stock equilibrado</div>`;
          return `
            <div class="stock-card">
              <div class="stock-card-name">${_esc(item.name)}</div>
              <div class="stock-card-grid">
                <div class="stock-card-cell">
                  <span class="stock-card-lbl">Usado (registos)</span>
                  <span class="stock-card-used">${used > 0 ? _fmt(used) : '—'} <span class="stock-card-unit">${_esc(item.unit)}</span></span>
                </div>
                <div class="stock-card-cell">
                  <span class="stock-card-lbl">Em Stock</span>
                  <div class="stock-input-wrap">
                    <input type="number" class="stock-qty-input"
                           data-key="${_esc(item.key)}"
                           value="${qty}" placeholder="0"
                           min="0" step="0.01" inputmode="decimal"
                           oninput="App.calcStockSaldo(this,${used},'${_esc(item.unit)}')">
                    <span class="stock-unit">${_esc(item.unit)}</span>
                  </div>
                </div>
              </div>
              ${saldoHtml}
              <input type="text" class="stock-notes-input"
                     data-notes-key="${_esc(item.key)}"
                     value="${notes}"
                     placeholder="📝 Notas...">
            </div>`;
        }).join('')}
      </div>

      <div class="stock-custom-section">
        <div class="stock-custom-header">
          <span class="stock-custom-title">➕ Outros Ingredientes</span>
          <button class="add-encomenda-btn" onclick="App.addCustomStock()">+ Adicionar</button>
        </div>
        <div id="custom-stock-list"></div>
      </div>

      <button class="stock-save-btn" onclick="App.saveStock()">💾 Guardar Stock</button>
    `;

    const customList  = document.getElementById('custom-stock-list');
    const savedCustom = _loadCustomStock();
    savedCustom.forEach(item => _appendCustomRow(customList, item));
  }

  function calcStockSaldo(inputEl, used, unit) {
    const qty    = parseFloat(inputEl.value);
    const saldoEl = inputEl.closest('.stock-card')?.querySelector('.stock-saldo');
    if (!saldoEl) return;
    if (isNaN(qty)) {
      saldoEl.className = 'stock-saldo stock-saldo--none';
      saldoEl.textContent = 'Insira o stock para ver o saldo';
      return;
    }
    const saldo = qty - used;
    const abs   = _fmt(Math.abs(saldo));
    if (saldo > 0) {
      saldoEl.className = 'stock-saldo stock-saldo--pos';
      saldoEl.textContent = `✅ +${abs} ${unit} disponível`;
    } else if (saldo < 0) {
      saldoEl.className = 'stock-saldo stock-saldo--neg';
      saldoEl.textContent = `⚠️ ${abs} ${unit} em falta`;
    } else {
      saldoEl.className = 'stock-saldo stock-saldo--zero';
      saldoEl.textContent = `✅ Stock equilibrado`;
    }
  }

  function saveStock() {
    const existing = _loadStock();
    const now = new Date().toISOString();

    // predefined items (qty + notes)
    document.querySelectorAll('.stock-qty-input[data-key]').forEach(input => {
      const key   = input.dataset.key;
      const val   = parseFloat(input.value);
      const notes = document.querySelector(`.stock-notes-input[data-notes-key="${CSS.escape(key)}"]`)?.value.trim() || '';
      if (key) existing[key] = { qty: isNaN(val) ? null : val, notes: notes || null, savedAt: now };
    });
    _saveStockData(existing);

    // custom items
    const customItems = [];
    document.querySelectorAll('#custom-stock-list .custom-stock-row').forEach(row => {
      const name  = row.querySelector('.custom-stock-name')?.value.trim() || '';
      const unit  = row.querySelector('.custom-stock-unit')?.value.trim() || '';
      const notes = row.querySelector('.custom-stock-notes')?.value.trim() || '';
      const val   = parseFloat(row.querySelector('.custom-stock-qty')?.value);
      if (name) customItems.push({ name, unit, qty: isNaN(val) ? null : val, notes: notes || null, savedAt: now });
    });
    _saveCustomStock(customItems);

    showToast('✅ Stock guardado!');
    _renderStock();
  }

  // ─── Custom stock items ───────────────────────────────────────

  const STOCK_CUSTOM_KEY = 'padaria_stock_custom_v1';
  let _customStockCounter = 0;

  function _loadCustomStock() {
    try { return JSON.parse(localStorage.getItem(STOCK_CUSTOM_KEY) || '[]'); } catch { return []; }
  }

  function _saveCustomStock(items) {
    try { localStorage.setItem(STOCK_CUSTOM_KEY, JSON.stringify(items)); } catch {}
  }

  function _appendCustomRow(container, item = {}) {
    _customStockCounter++;
    const id  = _customStockCounter;
    const row = document.createElement('div');
    row.className = 'custom-stock-row';
    row.id = `custom-stock-${id}`;
    row.innerHTML = `
      <div class="encomenda-top-row">
        <input type="text" class="custom-stock-name big-input"
               placeholder="Nome do ingrediente..." autocomplete="off"
               value="${_esc(item.name || '')}">
        <button class="saida-remove-btn" onclick="App.removeCustomStock(${id})">✕</button>
      </div>
      <div class="encomenda-bottom-row">
        <div class="encomenda-field">
          <span class="encomenda-field-lbl">Quantidade</span>
          <div class="encomenda-input-row">
            <input type="number" class="custom-stock-qty encomenda-qty"
                   placeholder="0" min="0" step="0.01" inputmode="decimal"
                   value="${item.qty != null ? item.qty : ''}">
          </div>
        </div>
        <div class="encomenda-field">
          <span class="encomenda-field-lbl">Unidade</span>
          <div class="encomenda-input-row">
            <input type="text" class="custom-stock-unit encomenda-qty"
                   placeholder="kg / L / g…" maxlength="12" autocomplete="off"
                   value="${_esc(item.unit || '')}">
          </div>
        </div>
      </div>
      <input type="text" class="stock-notes-input custom-stock-notes"
             placeholder="📝 Notas..."
             value="${_esc(item.notes || '')}">
      <button class="custom-stock-add-btn" onclick="App.confirmCustomStock(${id})">✅ Adicionar ao Stock</button>
    `;
    container.appendChild(row);
  }

  function confirmCustomStock(id) {
    const row  = document.getElementById(`custom-stock-${id}`);
    if (!row) return;
    const name = row.querySelector('.custom-stock-name')?.value.trim() || '';
    if (!name) { showToast('⚠️ Preencha o nome do ingrediente'); return; }

    // collect all current custom rows and save
    const now   = new Date().toISOString();
    const items = [];
    document.querySelectorAll('#custom-stock-list .custom-stock-row').forEach(r => {
      const n  = r.querySelector('.custom-stock-name')?.value.trim() || '';
      const u  = r.querySelector('.custom-stock-unit')?.value.trim() || '';
      const nt = r.querySelector('.custom-stock-notes')?.value.trim() || '';
      const v  = parseFloat(r.querySelector('.custom-stock-qty')?.value);
      if (n) items.push({ name: n, unit: u, qty: isNaN(v) ? null : v, notes: nt || null, savedAt: now });
    });
    _saveCustomStock(items);
    showToast('✅ Ingrediente adicionado ao stock!');
    _renderStock();
  }

  function addCustomStock() {
    const list = document.getElementById('custom-stock-list');
    if (!list) return;
    _appendCustomRow(list);
    list.lastElementChild?.querySelector('.custom-stock-name')?.focus();
  }

  function removeCustomStock(id) {
    const el = document.getElementById(`custom-stock-${id}`);
    if (el) el.remove();
  }

  function logout() {
    sessionStorage.removeItem('padaria_auth');
    sessionStorage.removeItem('padaria_role');
    const input = document.getElementById('pin-input');
    if (input) input.value = '';
    const errEl = document.getElementById('pin-error');
    if (errEl) errEl.textContent = '';
    _showScreen('screen-pin');
    document.getElementById('pin-input')?.focus();
  }

  function togglePinVisibility(btn) {
    const input = document.getElementById('pin-input');
    const show  = input.type === 'password';
    input.type  = show ? 'text' : 'password';
    btn.textContent = show ? '🙈' : '👁';
  }

  async function verifyPin() {
    const input = document.getElementById('pin-input');
    const errEl = document.getElementById('pin-error');
    const pin   = input.value.trim();
    if (!pin) return;
    errEl.textContent = '';
    try {
      const res  = await fetch('/api/verify-pin', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem('padaria_auth', '1');
        sessionStorage.setItem('padaria_role', data.role || 'vendas');
        _goToRoleScreen(data.role);
      } else {
        errEl.textContent = '❌ PIN incorreto. Tente novamente.';
        input.value = '';
        input.focus();
      }
    } catch {
      errEl.textContent = '⚠️ Erro de ligação. Verifique a rede.';
    }
  }

  // ─── Init ─────────────────────────────────────────────────────

  function init() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('vendas-data').value = today;
    document.getElementById('prod-data').value   = today;

    if (sessionStorage.getItem('padaria_auth') === '1') {
      const role = sessionStorage.getItem('padaria_role') || 'vendas';
      _goToRoleScreen(role);
    } else {
      document.getElementById('pin-input')?.focus();
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  // Public API
  return {
    goToShiftPick,
    goToFromShiftPick,
    goTo,
    goHome,
    changeQty,
    calcVendasTotals,
    calcProdTotals,
    submitVendas,
    submitProducao,
    clearResumo,
    showToast,
    addSaida,
    removeSaida,
    addEncomenda,
    removeEncomenda,
    showConfirm,
    confirmAndSubmit,
    backToVendas,
    verifyPin,
    togglePinVisibility,
    switchAdminTab,
    saveStock,
    calcStockSaldo,
    addCustomStock,
    confirmCustomStock,
    removeCustomStock,
    logout,
  };
})();

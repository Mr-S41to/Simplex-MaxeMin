function inicializarTableau(c, A, b) {
    const numRestricoes = A.length;
    const numVariaveis = c.length;
    const tableau = Array.from({ length: numRestricoes + 1 }, () =>
      Array(numVariaveis + numRestricoes + 1).fill(0)
    );
  
    // Preenche a linha Z.
    for (let j = 0; j < numVariaveis; j++) {
      tableau[0][j] = c[j]; // Função objetivo para minimização.
    }
  
    // Preenche as restrições e variáveis de folga.
    for (let i = 0; i < numRestricoes; i++) {
      for (let j = 0; j < numVariaveis; j++) {
        tableau[i + 1][j] = A[i][j];
      }
      tableau[i + 1][numVariaveis + i] = 1; // Variável de folga.
      tableau[i + 1][tableau[0].length - 1] = b[i];
    }
  
    return tableau;
  }
  
  function imprimirTableau(tableau, nomesVariaveis) {
    // Exibe o tableau formatado com nomes de variáveis e valores.
    console.log("Tableau:");
    console.log("     | " + nomesVariaveis.join("\t"));
    tableau.forEach((linha, indice) => {
      const nomeLinha = indice === 0 ? "Z" : `S${indice}`;
      console.log(
        `${nomeLinha}  | ` +
        linha.map((x) => x.toFixed(2)).join("\t")
      );
    });
    console.log("\n");
  }
  
  function encontrarColunaPivo(tableau) {
    // Determina a coluna pivô (regra do menor coeficiente na linha Z).
    const indiceUltimaColuna = tableau[0].length - 1;
    let menorValor = 0;
    let colunaPivo = -1;
  
    for (let j = 0; j < indiceUltimaColuna; j++) {
      if (tableau[0][j] < menorValor) {
        menorValor = tableau[0][j];
        colunaPivo = j;
      }
    }
    return colunaPivo;
  }
  
  function encontrarLinhaPivo(tableau, colunaPivo) {
    // Determina a linha pivô (razão mínima positiva entre LD e o elemento da coluna pivô).
    const indiceUltimaColuna = tableau[0].length - 1;
    let menorRazao = Infinity;
    let linhaPivo = -1;
    let coeficientes = [];
  
    for (let i = 1; i < tableau.length; i++) {
      const elemento = tableau[i][colunaPivo];
      if (elemento > 0) {
        const razao = tableau[i][indiceUltimaColuna] / elemento;
        coeficientes.push(razao);
        if (razao < menorRazao) {
          menorRazao = razao;
          linhaPivo = i;
        }
      } else {
        coeficientes.push(Infinity);
      }
    }
  
    // Mostra os coeficientes mínimos para determinar a linha pivô.
    console.log(`Coeficientes mínimos para linha pivô: ${coeficientes.map(x => x.toFixed(2)).join(", ")}`);
    return linhaPivo;
  }
  
  function realizarPivo(tableau, linhaPivo, colunaPivo) {
    // Realiza o pivoteamento para atualizar o tableau.
    const elementoPivo = tableau[linhaPivo][colunaPivo];
    console.log(`Elemento pivô: ${elementoPivo.toFixed(2)}`);
  
    // Normaliza a linha do pivô.
    for (let j = 0; j < tableau[0].length; j++) {
      tableau[linhaPivo][j] /= elementoPivo;
    }
  
    console.log(`Linha ${linhaPivo} normalizada:` + tableau[linhaPivo].map((x) => x.toFixed(2)).join("\t"));
  
    // Ajusta as outras linhas.
    for (let i = 0; i < tableau.length; i++) {
      if (i !== linhaPivo) {
        const fator = tableau[i][colunaPivo];
        for (let j = 0; j < tableau[0].length; j++) {
          tableau[i][j] -= fator * tableau[linhaPivo][j];
        }
      }
    }
  
    // Mostra a nova linha Z após atualização.
    console.log("Nova linha Z: " + tableau[0].map((x) => x.toFixed(2)).join("\t"));
  }
  
  function resolverSimplex(c, A, b) {
    // Configura os nomes das variáveis e inicializa o tableau.
    const nomesVariaveis = c.map((_, i) => `x${i + 1}`).concat(
      A.map((_, i) => `S${i + 1}`),
      "LD"
    );
    let tableau = inicializarTableau(c, A, b);
  
    imprimirTableau(tableau, nomesVariaveis);
    while (true) {
      const colunaPivo = encontrarColunaPivo(tableau);
      if (colunaPivo === -1) {
        console.log("Solução ótima encontrada!");
        break;
      }
  
      const linhaPivo = encontrarLinhaPivo(tableau, colunaPivo);
      if (linhaPivo === -1) {
        console.error("Problema ilimitado!");
        return;
      }
  
      // Mostra a linha e a coluna pivô.
      console.log(`Pivô na linha ${linhaPivo} (${nomesVariaveis[linhaPivo + 1]}) e coluna ${colunaPivo} (${nomesVariaveis[colunaPivo]})\n`);
      realizarPivo(tableau, linhaPivo, colunaPivo);
      imprimirTableau(tableau, nomesVariaveis);
    }
  
    // Calcula a solução final.
    const solucao = Array(c.length).fill(0);
    const indiceUltimaColuna = tableau[0].length - 1;
    for (let i = 1; i < tableau.length; i++) {
      for (let j = 0; j < c.length; j++) {
        if (tableau[i][j] === 1) {
          solucao[j] = tableau[i][indiceUltimaColuna];
        }
      }
    }
  
    // Mostra a solução final.
    console.log("Solução:");
    Object.entries(solucao).forEach(([variavel, valor]) => {
      console.log(`${variavel} = ${valor.toFixed(2)}`);
    });
    console.log("Valor de Z:", tableau[0][indiceUltimaColuna].toFixed(2));
  }
  
  
  //   //Exercicio 1.
    // Min Z = -x1 + 3x2
    // Sujeito a:
    // 2x1 + 3x2 <= 6
    // -x1 + x2 <= 1
    // x1, x2 >= 0
    
    const c = [-1, 3]; //Coeficientes da função objetivo.
    const A = [
      [2, 3],
      [-1, 1],
    ]; //Coeficientes das restrições.
    const b = [6, 1]; //Lados direitos das restrições.
  
    //Exercicio 3.
    //Min z =-2x1 - x2
    //Sujeito a:
    //3x1 + x2 <= 9
    //2x1 - 2x2 <= 3 
    //x1, x2 >= 0
  
    // const c = [-2, 1]; //Coeficientes da função objetivo.
    // const A = [
    //   [3, 1],
    //   [2, -2],
    // ]; //Coeficientes das restrições.
    // const b = [9, 3]; //Lados direitos das restrições.
  
  resolverSimplex(c, A, b);

  


  function inicializarTableau(c, A, b) {
    const numRestricoes = A.length;
    const numVariaveis = c.length;
    const tableau = Array.from({ length: numRestricoes + 1 }, () =>
      Array(numVariaveis + numRestricoes + 1).fill(0)
    );
  
    // Preenche a linha Z.
    for (let j = 0; j < numVariaveis; j++) {
      tableau[0][j] = c[j]; // Função objetivo para minimização.
    }
  
    // Preenche as restrições e variáveis de folga.
    for (let i = 0; i < numRestricoes; i++) {
      for (let j = 0; j < numVariaveis; j++) {
        tableau[i + 1][j] = A[i][j];
      }
      tableau[i + 1][numVariaveis + i] = 1; // Variável de folga.
      tableau[i + 1][tableau[0].length - 1] = b[i];
    }
  
    return tableau;
  }
  
  function imprimirTableau(tableau, nomesVariaveis) {
    // Exibe o tableau formatado com nomes de variáveis e valores.
    console.log("Tableau:");
    console.log("     | " + nomesVariaveis.join("\t"));
    tableau.forEach((linha, indice) => {
      const nomeLinha = indice === 0 ? "Z" : `S${indice}`;
      console.log(
        `${nomeLinha}  | ` +
        linha.map((x) => x.toFixed(2)).join("\t")
      );
    });
    console.log("\n");
  }
  
  function encontrarColunaPivo(tableau) {
    // Determina a coluna pivô (regra do menor coeficiente na linha Z).
    const indiceUltimaColuna = tableau[0].length - 1;
    let menorValor = 0;
    let colunaPivo = -1;
  
    for (let j = 0; j < indiceUltimaColuna; j++) {
      if (tableau[0][j] < menorValor) {
        menorValor = tableau[0][j];
        colunaPivo = j;
      }
    }
    return colunaPivo;
  }
  
  function encontrarLinhaPivo(tableau, colunaPivo) {
    // Determina a linha pivô (razão mínima positiva entre LD e o elemento da coluna pivô).
    const indiceUltimaColuna = tableau[0].length - 1;
    let menorRazao = Infinity;
    let linhaPivo = -1;
    let coeficientes = [];
  
    for (let i = 1; i < tableau.length; i++) {
      const elemento = tableau[i][colunaPivo];
      if (elemento > 0) {
        const razao = tableau[i][indiceUltimaColuna] / elemento;
        coeficientes.push(razao);
        if (razao < menorRazao) {
          menorRazao = razao;
          linhaPivo = i;
        }
      } else {
        coeficientes.push(Infinity);
      }
    }
  
    // Mostra os coeficientes mínimos para determinar a linha pivô.
    console.log(`Coeficientes mínimos para linha pivô: ${coeficientes.map(x => x.toFixed(2)).join(", ")}`);
    return linhaPivo;
  }
  
  function realizarPivo(tableau, linhaPivo, colunaPivo) {
    // Realiza o pivoteamento para atualizar o tableau.
    const elementoPivo = tableau[linhaPivo][colunaPivo];
    console.log(`Elemento pivô: ${elementoPivo.toFixed(2)}`);
  
    // Normaliza a linha do pivô.
    for (let j = 0; j < tableau[0].length; j++) {
      tableau[linhaPivo][j] /= elementoPivo;
    }
  
    console.log(`Linha ${linhaPivo} normalizada:` + tableau[linhaPivo].map((x) => x.toFixed(2)).join("\t"));
  
    // Ajusta as outras linhas.
    for (let i = 0; i < tableau.length; i++) {
      if (i !== linhaPivo) {
        const fator = tableau[i][colunaPivo];
        for (let j = 0; j < tableau[0].length; j++) {
          tableau[i][j] -= fator * tableau[linhaPivo][j];
        }
      }
    }
  
    // Mostra a nova linha Z após atualização.
    console.log("Nova linha Z: " + tableau[0].map((x) => x.toFixed(2)).join("\t"));
  }
  
  function resolverSimplex(c, A, b) {
    // Configura os nomes das variáveis e inicializa o tableau.
    const nomesVariaveis = c.map((_, i) => `x${i + 1}`).concat(
      A.map((_, i) => `S${i + 1}`),
      "LD"
    );
    let tableau = inicializarTableau(c, A, b);
  
    imprimirTableau(tableau, nomesVariaveis);
    while (true) {
      const colunaPivo = encontrarColunaPivo(tableau);
      if (colunaPivo === -1) {
        console.log("Solução ótima encontrada!");
        break;
      }
  
      const linhaPivo = encontrarLinhaPivo(tableau, colunaPivo);
      if (linhaPivo === -1) {
        console.error("Problema ilimitado!");
        return;
      }
  
      // Mostra a linha e a coluna pivô.
      console.log(`Pivô na linha ${linhaPivo} (${nomesVariaveis[linhaPivo + 1]}) e coluna ${colunaPivo} (${nomesVariaveis[colunaPivo]})\n`);
      realizarPivo(tableau, linhaPivo, colunaPivo);
      imprimirTableau(tableau, nomesVariaveis);
    }
  
    // Calcula a solução final.
    const solucao = Array(c.length).fill(0);
    const indiceUltimaColuna = tableau[0].length - 1;
    for (let i = 1; i < tableau.length; i++) {
      for (let j = 0; j < c.length; j++) {
        if (tableau[i][j] === 1) {
          solucao[j] = tableau[i][indiceUltimaColuna];
        }
      }
    }
  
    // Mostra a solução final.
    console.log("Solução:");
    Object.entries(solucao).forEach(([variavel, valor]) => {
      console.log(`${variavel} = ${valor.toFixed(2)}`);
    });
    console.log("Valor de Z:", tableau[0][indiceUltimaColuna].toFixed(2));
  }
  
  
  //   //Exercicio 1.
    // Min Z = -x1 + 3x2
    // Sujeito a:
    // 2x1 + 3x2 <= 6
    // -x1 + x2 <= 1
    // x1, x2 >= 0
    
    const c = [-1, 3]; //Coeficientes da função objetivo.
    const A = [
      [2, 3],
      [-1, 1],
    ]; //Coeficientes das restrições.
    const b = [6, 1]; //Lados direitos das restrições.
  
    //Exercicio 3.
    //Min z =-2x1 - x2
    //Sujeito a:
    //3x1 + x2 <= 9
    //2x1 - 2x2 <= 3 
    //x1, x2 >= 0
  
    // const c = [-2, 1]; //Coeficientes da função objetivo.
    // const A = [
    //   [3, 1],
    //   [2, -2],
    // ]; //Coeficientes das restrições.
    // const b = [9, 3]; //Lados direitos das restrições.
  
  resolverSimplex(c, A, b);

  


  
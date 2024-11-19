function inicializarTableau(c, A, b) {
    const numRestricoes = A.length;
    const numVariaveis = c.length;
    const tableau = Array.from({ length: numRestricoes + 1 }, () =>
      Array(numVariaveis + numRestricoes + 1).fill(0)
    );
  
    //Preenche a linha Z.
    for (let j = 0; j < numVariaveis; j++) {
      tableau[0][j] = -c[j];
    }
  
    //Preenche as restrições e variáveis de folga.
    for (let i = 0; i < numRestricoes; i++) {
      for (let j = 0; j < numVariaveis; j++) {
        tableau[i + 1][j] = A[i][j];
      }
      tableau[i + 1][numVariaveis + i] = 1; //Variável de folga.
      tableau[i + 1][tableau[0].length - 1] = b[i];
    }
  
    return tableau;
  }
  
  function imprimirTableau(tableau) {
    console.log("Tableau:");
    tableau.forEach((linha, indice) => {
      console.log(
        (indice === 0 ? "Z  |" : `S${indice} |`) +
          linha.map((x) => x.toFixed(2)).join("\t")
      );
    });
    console.log("\n");
  }
  
  function encontrarColunaPivo(tableau) {
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
    const indiceUltimaColuna = tableau[0].length - 1;
    let menorRazao = Infinity;
    let linhaPivo = -1;
  
    for (let i = 1; i < tableau.length; i++) {
      const elemento = tableau[i][colunaPivo];
      if (elemento > 0) {
        const razao = tableau[i][indiceUltimaColuna] / elemento;
        if (razao < menorRazao) {
          menorRazao = razao;
          linhaPivo = i;
        }
      }
    }
    return linhaPivo;
  }
  
  function realizarPivo(tableau, linhaPivo, colunaPivo) {
    const elementoPivo = tableau[linhaPivo][colunaPivo];
  
    //Normaliza a linha do pivo.
    for (let j = 0; j < tableau[0].length; j++) {
      tableau[linhaPivo][j] /= elementoPivo;
    }
  
    //Mostra a linha pivô após a normalização.
    console.log(`Linha ${linhaPivo} após normalização:`);
    console.log(tableau[linhaPivo].map((x) => x.toFixed(2)).join("\t"));
  
    //Ajusta as outras linhas.
    console.log("Atualizando as demais linhas:");
    for (let i = 0; i < tableau.length; i++) {
      if (i !== linhaPivo) {
        const fator = tableau[i][colunaPivo];
        for (let j = 0; j < tableau[0].length; j++) {
          tableau[i][j] -= fator * tableau[linhaPivo][j];
        }
      }
    }
  }
  
  function resolverSimplex(c, A, b) {
    let tableau = inicializarTableau(c, A, b);
  
    imprimirTableau(tableau);
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
  
      console.log(`Pivo na linha ${linhaPivo} e coluna ${colunaPivo}\n`);
      realizarPivo(tableau, linhaPivo, colunaPivo);
      imprimirTableau(tableau);
    }
  
    const solucao = Array(c.length).fill(0);
    const indiceUltimaColuna = tableau[0].length - 1;
    for (let i = 1; i < tableau.length; i++) {
      for (let j = 0; j < c.length; j++) {
        if (tableau[i][j] === 1) {
          solucao[j] = tableau[i][indiceUltimaColuna];
        }
      }
    }
  
    console.log("Solução:", solucao);
    console.log("Valor de Z:", tableau[0][indiceUltimaColuna]);
  }
  
  //Exercicio 1.
  // Min Z = -x1 + 3x2
  // Sujeito a:
  // 2x1 + 3x2 <= 6
  // -x1 + x2 <= 1
  // x1, x2 >= 0
  
  // const c = [-1, 3]; //Coeficientes da função objetivo.
  // const A = [
  //   [2, 3],
  //   [-1, 1],
  // ]; //Coeficientes das restrições.
  // const b = [6, 1]; //Lados direitos das restrições.

  //Exercicio 3.
  //Min z =-2x1 - x2
  //Sujeito a:
  //3x1 + x2 <= 9
  //2x1 - 2x2 <= 3 
  //x1, x2 >= 0

  const c = [-2, 1]; //Coeficientes da função objetivo.
  const A = [
    [3, 1],
    [2, -2],
  ]; //Coeficientes das restrições.
  const b = [9, 3]; //Lados direitos das restrições.
  
  
  resolverSimplex(c, A, b);
  
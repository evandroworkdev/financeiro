#01
Como tratar corretamente no frontEnd quando não houver resposta adequadas
desde de um erro 500 ou até mesmo quando o backend estiver indisponível

#02
Se o método retorna void, onde é identificado que não existe categoria,
se não houver a id da categoria?
const categoriaExcluida = await this.serverFacade.categoria.excluir(usuarioId, { id });

          if (!categoriaExcluida) {
            res.status(404).json({
              erro: {
                codigo: 404,
                mensagem: "Categoria não encontrada",
              },
            });
            return;
          }
          res.sendStatus(204);

#03
Update não precisa verificar se existe o item, essa responsabilidade
é do serviço de dominio

#04
where: { usuario_id: usuarioId, id: categoria.id }, verificar se tem efeito
quando não existe um constrain unique referenciado os dois campos

const base64Data = require("./base64");

module.exports = {
	roles: [
		{ title: "unsigned" }, // id: 1
		{ title: "admin" }, // id: 2
		{ title: "estudante" }, // id: 3
		{ title: "professor" }, // id: 4
	],

	schools: [
		{ name: "ESMAD" }, // id: 1
		{ name: "ESAG" }, // id: 2
		{ name: "ESTG" }, // id: 3
		{ name: "ESTM" }, // id: 4
		{ name: "ESTSP" }, // id: 5
		{ name: "ESTeSC" }, // id: 6
		{ name: "ISCEM" }, // id: 7
		{ name: "IST" }, // id: 8
		{ name: "UBI" }, // id: 9
		{ name: "UFSC" }, // id: 10
		{ name: "UTAD" }, // id: 11
		{ name: "UTL" }, // id: 12
	],

	users: [
		{
			email: "Admin@esmad.ipp.pt",
			name: "Admin",
			password: "Esmad_2223",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=admin",
			role_id: 2,
			school_id: 1,
		},
		{
			email: "User@esmad.ipp.pt",
			name: "User",
			password: "Esmad_2223",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=user",
			role_id: 3,
			school_id: 1,
			internal_id: "40210462",
			course: "TSIW",
			year: 2,
		},
		{
			email: "jorgelima123@esmad.ipp.pt",
			name: "Jorge Lima",
			password: "123",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=jorge_lima",
			role_id: 4,
			school_id: 1,
		},
		{
			email: "tiago.d.ribeiro@hotmail.com",
			name: "Tiago Ribeiro",
			password: "2525",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=tiago_ribeiro",
			role_id: 2,
			school_id: 1,
			internal_id: "40210462",
			course: "TSIW",
			year: 2,
		},
		{
			email: "pedromst2000@gmail.com",
			name: "Pedro Teixeira",
			password: "123",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=pedro_teixeira",
			role_id: 3,
			school_id: 1,
			internal_id: "40210465",
			course: "TSIW",
			year: 2,
		},
		{
			email: "josepprn@gmail.com",
			name: "José Nogueira",
			password: "123",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=jose_nogueira",
			role_id: 3,
			school_id: 1,
			internal_id: "40210472",
			course: "TSIW",
			year: 2,
		},
		{
			email: "manuela.santos123@esmad.ipp.pt",
			name: "Manuela Santos",
			password: "123",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=manuela_santos",
			role_id: 3,
			school_id: 1,
			internal_id: "99999999",
			course: "Multimédia",
			year: 1,
		},
		{
			email: "joaquim.honesto@esmad.ipp.pt",
			name: "Joaquim Honesto",
			password: "123",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=joaquim_honesto",
			role_id: 3,
			school_id: 1,
			internal_id: "99999998",
			course: "Multimédia",
			year: 3,
		},
		{
			email: "mariopinto123@esmad.ipp.pt",
			name: "Mário Pinto",
			password: "123",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=mario_pinto",
			role_id: 4,
			school_id: 1,
		},
		{
			email: "not.a.bot@email.com",
			name: "Not a Bot",
			password: "123",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=not_a_bot",
			role_id: 1,
			school_id: 2,
		},
		{
			email: "john.doe@email.com",
			name: "John Doe",
			password: "123",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=john_doe",
			role_id: 3,
			school_id: 3,
		},
		{
			email: "jane.done@email.com",
			name: "Jane Done",
			password: "123",
			photo: "https://api.dicebear.com/5.x/personas/svg?seed=jane_done",
			role_id: 1,
			school_id: 4,
		},
	],

	badges: [
		{
			title: "Novato das atividades",
			description: "Crie uma atividade",
			img: base64Data.badge1,
		},
		{
			description: "Crie dez atividades",
			title: "Veterano das atividades",
			img: base64Data.badge2,
		},
		{
			description: "Finalize uma atividade no último dia de calendarização",
			title: "Preciso",
			img: base64Data.badge3,
		},
		{
			description: "Marque uma reunião",
			title: "Novato das Reuniões",
			img: base64Data.badge4,
		},
		{
			description: "Adiciona uma ata a uma reunião",
			title: "Supervisor das reuniões",
			img: base64Data.badge5,
		},
		{
			description: "Contacte membros do conselho",
			title: "Mensageiro",
			img: base64Data.badge6,
		},
		{
			description: "Publique uma notícia",
			title: "Jornalista amador",
			img: base64Data.badge7,
		},
		{
			description: "Marque três reuniões",
			title: "Veterano das reuniões",
			img: base64Data.badge8,
		},
	],

	user_badge: [
		//* User 1
		{
			user_id: 1,
			badge_id: 1,
			is_highlight: false,
		},
		{
			user_id: 1,
			badge_id: 3,
			is_highlight: true,
		},
		{
			user_id: 1,
			badge_id: 5,
			is_highlight: false,
		},

		//* User 2
		{
			user_id: 2,
			badge_id: 1,
			is_highlight: false,
		},
		{
			user_id: 2,
			badge_id: 2,
			is_highlight: false,
		},
		{
			user_id: 2,
			badge_id: 4,
			is_highlight: true,
		},
		{
			user_id: 2,
			badge_id: 6,
			is_highlight: false,
		},

		//* User 3
		{
			user_id: 3,
			badge_id: 3,
			is_highlight: false,
		},
		{
			user_id: 3,
			badge_id: 6,
			is_highlight: false,
		},
		{
			user_id: 3,
			badge_id: 7,
			is_highlight: true,
		},

		//* User 4
		{
			user_id: 4,
			badge_id: 1,
			is_highlight: false,
		},
		{
			user_id: 4,
			badge_id: 3,
			is_highlight: true,
		},

		//* User 5
		{
			user_id: 5,
			badge_id: 1,
			is_highlight: false,
		},
		{
			user_id: 5,
			badge_id: 2,
			is_highlight: true,
		},

		//* User 6
		{
			user_id: 6,
			badge_id: 1,
			is_highlight: false,
		},
		{
			user_id: 6,
			badge_id: 4,
			is_highlight: true,
		},

		//* User 7
		{
			user_id: 7,
			badge_id: 1,
			is_highlight: false,
		},
		{
			user_id: 7,
			badge_id: 2,
			is_highlight: false,
		},
		{
			user_id: 7,
			badge_id: 5,
			is_highlight: false,
		},
		{
			user_id: 7,
			badge_id: 7,
			is_highlight: true,
		},
	],

	news: [
		{
			creator_id: 1,
			title: "Portugal é um dos países que mais vai sentir as alterações climáticas",
			content:
				"Portugal é em toda a Europa um dos países que mais sente, e mais vai sentir, os efeitos das alterações climáticas e dos fenómenos extremos e subida do nível de águas”, afirmou o governante, em Vila do Conde, no distrito do Porto, a discursar numa cerimónia de assinatura de um protocolo de intervenção para proteger o sistema dunar entre Mindelo e a Ribeira de Silvares. Duarte Cordeiro salientou que “todo o litoral vai obrigar a uma atuação permanente, vigilante e persistente de recarga de praias, reposição do sistema dunar, manutenção de estruturas de defesa costeira, de desassoreamento dos sistemas dunar e das barras. Quanto ao projeto protocolado, orçado em 800 mil euros, para proteção do sistema dunar entre Mindelo e a Ribeira de Silvares, segundo explicou o vice-presidente da Agência Portuguesa do Ambiente, Pimenta Machado, aquele pretende resolver “o agravamento do estado da erosão costeira, da deslocação da duna primária para o interior e da invasão do passadiço existente na área e o quadro de instabilidade dunar e estrutural” resultante dos “grandes volumes de areia” no local. Na sessão, foi ainda anunciado que a intervenção de proteção e reabilitação da marginal da praia de Árvore, em Vila do Conde, vai “estar em curso até ao final deste mês”. No total, o plano de recuperação e requalificação ambiental de Vila do Conde prevê um investimento de cerca de cinco milhões de euros em quatro projetos, sendo eles o de proteção e reabilitação do sistema costeiro na Marginal Atlântica (1,09 milhões de euros) e de proteção e reabilitação da defesa aderente da marginal da praia de Árvore (1,8 milhões de euros), ambos já aprovados para financiamento europeu, e o projeto de reabilitação da marginal no rio Ave (1,98 milhões de euros) e de proteção do sistema dunal entre Mindelo e a Ribeira de Silvares (0,8 milhões de euros), estes em fase de candidatura ao Programa Operacional Sustentabilidade e Eficiência no Uso de Recursos (POSEUR).",
			date_created: "2022-05-01",
		},
		{
			creator_id: 1,
			title: "Biocombustíveis: Ser sustentável para reduzir a pegada ecológica",
			content:
				"A sustentabilidade é um conceito em voga nos dias de hoje, mas será que todos estamos conscientes do que significa? Para além das questões relacionadas com a crescente preocupação com o ambiente, a palavra adquire novas dimensões com cada vez mais pessoas a assumirem uma forma de estar sustentável e a refletir esta filosofia nas suas opções de consumo. As marcas seguindo esta tendência aproximam-se do conceito de sustentabilidade, posicionando-se como socialmente responsáveis e amigas do ambiente. O significado da sustentabilidade tem sido amplamente discutido, mas muito pouco compreendido na sua verdadeira dimensão. Inicialmente surgiu associado ao ambiente, ou seja, à capacidade dos ecossistemas se recuperarem e se reproduzirem perante agressões externas. Mais tarde começou a ser aplicado à economia perante a constatação de que os recursos do planeta são escassos, dando origem à expressão desenvolvimento sustentável que alerta para o facto de nada justificar que os avanços económico e tecnológicos possam destruir o planeta e colocar em causa o futuro das gerações vindouras. Por fim, a sustentabilidade começou também a ser encarada no prisma da dimensão social sob a premissa de que para uma sociedade mais saudável é necessário combater as desigualdades sociais. As três dimensões da sustentabilidade – ambiental, económica e social – devem interagir de forma equilibrada para que o desenvolvimento humano e o crescimento económico sejam compatíveis com a preservação do meio ambiente. O combate às alterações climáticas é um desafio para a humanidade e não pode (nem deve) ser ignorado. Os biocombustíveis permitem dar um passo sólido em direção à sustentabilidade energética de longo prazo com o bónus de contribuírem para uma menor emissão de dióxido de carbono, o grande responsável pela elevação do efeito de estufa que afeta drasticamente o equilíbrio do planeta e contribui para o aquecimento global.",
			date_created: "2022-05-02",
		},
		{
			creator_id: 1,
			title: "Guimarães, Porto e Lisboa entre 100 cidades da UE neutras e inteligentes até 2030",
			content:
				"As três cidades portuguesas foram selecionadas em Portugal para participar na missão da União Europeia para ecossistemas de inovação, rumo à neutralidade climática até 2030. Guimarães, Porto e Lisboa foram as cidades selecionadas em Portugal para participar na missão da União Europeia (UE) para ecossistemas de inovação e com vista à neutralidade do ponto de vista climático até 2030, foi anunciado esta quinta-feira. A informação foi divulgada pela Comissão Europeia, que em comunicado dá conta dos municípios europeus escolhidos para a “Missão da UE para 100 cidades neutras e inteligentes até 2030, a chamada Missão Cidades”. “As 100 cidades vêm de todos os 27 Estados-membros, com 12 cidades adicionais vindas de países associados ou com o potencial de serem associadas ao Horizonte Europa, o programa de investigação e inovação da UE”, assinala a instituição. Em Portugal, as três cidades selecionadas foram então Guimarães, Porto e Lisboa. Com um orçamento total de 360 milhões de euros de financiamento do Horizonte Europa para o período 2022-23, a iniciativa visa então criar projetos de inovação rumo à neutralidade climática até 2030 As ações de investigação e inovação irão abranger áreas como a mobilidade limpa, a eficiência energética e o planeamento urbano verde, permitindo ainda a criação de iniciativas conjuntas e a colaboração com outros programas da UE. Caberá agora à Comissão Europeia convidar as 100 cidades selecionadas a desenvolver contratos de cidades climáticas, que incluirão um plano global de neutralidade climática em todos os setores, tais como energia, edifícios, gestão de resíduos e transportes, juntamente com planos de investimento conexos. A ideia é que este processo envolva cidadãos, organizações de investigação e o setor privado, com vista ao estabelecimento de compromissos “claros e visíveis” assumidos pelas cidades nos Contratos das Cidades Climáticas, explica o executivo comunitário. As áreas urbanas da UE acolhem 75% do total de cidadãos. Globalmente, as áreas urbanas consomem mais de 65% da energia mundial, sendo responsáveis por mais de 70% das emissões de dióxido de carbono.",
			date_created: "2022-05-03",
		},
		{
			creator_id: 1,
			title: "Governo anuncia plano ambicioso para reduzir emissões de gases de efeito estufa em 50% até 2030",
			content:
				"O governo anunciou hoje um plano ambicioso para reduzir as emissões de gases de efeito estufa em 50% até 2030. O plano inclui medidas para aumentar a eficiência energética, aumentar a produção de energia renovável e promover práticas de agricultura e florestamento sustentáveis.'Este é um passo crucial na luta contra as mudanças climáticas e na proteção do nosso planeta para as gerações futuras', disse o Ministro do Meio Ambiente em coletiva de imprensa. 'Temos que agir agora para evitar os piores impactos das mudanças climáticas e garantir um futuro sustentável para todos. O plano também inclui incentivos para as empresas que adotarem práticas mais limpas e investirem em tecnologias de baixo carbono, bem como medidas para aumentar a consonantização pública sobre a importância da luta contra as mudanças climáticas. Espera-se que o plano tenha um impacto significativo na redução das emissões de gases de efeito estufa e na proteção do meio ambiente, e é visto como um passo importante em direção a um futuro mais sustentável.",
			date_created: "2022-05-04",
		},
		{
			creator_id: 1,
			title: "Nova tecnologia de armazenamento de energia anunciada como solução para problemas de eletricidade",
			content:
				"Uma empresa de tecnologia anunciou hoje o desenvolvimento de uma nova tecnologia de armazenamento de energia que pode revolucionar a forma como a eletricidade é gerada e distribuída. A tecnologia é baseada em baterias avançadas que podem armazenar grandes quantidades de energia elétrica com eficiência e segurança. De acordo com a empresa, a nova tecnologia permitirá que a energia gerada por fontes renováveis, como solares e eólicas, seja armazenada e distribuída quando e onde ela é necessária. Isso eliminará a necessidade de usar fontes de energia não renováveis ​​como combustíveis fósseis para suprir a demanda durante picos de consumo. Além disso, a tecnologia de armazenamento de energia também pode ajudar a tornar a rede elétrica mais segura e resiliente, reduzindo o risco de interrupções de energia e aumentando a confiabilidade do fornecimento de energia. A empresa planeia começar a testar a nova tecnologia em parceria com empresas de energia e espera ter a tecnologia disponível para o mercado em poucos anos. Esse anúncio foi recebido com entusiasmo pela indústria e pelos defensores da energia limpa, com especialistas afirmando que a tecnologia tem o potencial de transformar a forma como geramos e usamos a energia.",
			date_created: "2022-06-10",
		},
		{
			creator_id: 1,
			title: "Descoberta de nova espécie animais em área selvagem chama a atenção da comunidade científica",
			content:
				"Uma equipe de cientistas anunciou hoje a descoberta de uma nova espécie de animal em uma área selvagem remota. A espécie, que é um mamífero semelhante a um roedor, foi descoberta durante uma expedição de campo e tem características físicas e comportamentais únicas. De acordo com os cientistas, a descoberta é notável porque a área onde a espécie foi encontrada é pouco explorada e é rara a descoberta de novas espécies animais nessa região. A espécie também apresenta adaptações interessantes à vida na floresta, incluindo uma cauda preênsil e habilidades de escalada. Os cientistas estão agora trabalhando para estudar a nova espécie e entender melhor sua ecologia e relações de espécies. Eles também estão trabalhando com as autoridades locais para garantir a proteção da nova espécie e de sua habitat. A descoberta tem chamado a atenção da comunidade científica e tem o potencial de fornecer insights valiosos sobre a biodiversidade e a evolução dos animais. Além disso, também chama atenção para a necessidade de proteção das áreas selvagens e de preservação da biodiversidade.",
			date_created: "2022-06-11",
		},
		{
			creator_id: 1,
			title: "Descoberta de nova civilização antiga no mundo desafia a compreensão histórica",
			content:
				"Uma equipe de arqueólogos e antropólogos anunciou hoje a descoberta de uma nova civilização antiga em uma região remota do mundo. A descoberta foi feita durante uma série de escavações e incluiu uma variedade de artefactos e estruturas que sugerem a existência de uma sociedade avançada com uma longa história. De acordo com os arqueólogos, a civilização descoberta apresenta características únicas e desconhecidas, incluindo tecnologias avançadas e uma escrita desconhecida. A equipe também encontrou evidências de práticas religiosas e cerimoniais complexas, bem como uma arquitetura monumentais. A descoberta tem gerado grande interesse e especulação entre a comunidade científica e histórica. Alguns especialistas sugerem que a civilização descoberta pode ter tido contacto e influência sobre outras civilizações conhecidas, enquanto outros argumentam que pode ter existido de forma isolada e independente. A equipe de pesquisa agora está trabalhando para traduzir e decifrar a escrita desconhecida e estudar os artefactos e estruturas encontrados, para compreender melhor a história e a cultura da civilização descoberta. A descoberta também tem implicações éticas e políticas significativas, já que a região onde a civilização foi descoberta é habitada atualmente por uma comunidade indígena. A equipe de pesquisa está trabalhando em estreita colaboração com essa comunidade e as autoridades locais para garantir a proteção e preservação dos artefactos e estruturas encontrados, bem como o respeito pelos direitos e cultura da comunidade indígena. A descoberta tem o potencial de mudar radicalmente a compreensão da história humana e do desenvolvimento das civilizações. E também chama a atenção para a importância da preservação da cultura e dos direitos das comunidades indígenas.",
			date_created: "2022-06-12",
		},
	],

	new_image: [
		{
			new_id: 1,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/news/fud6l529esdqwffemrgj.png",
		},
		{
			new_id: 1,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/news/ijhxmekogxfq9fnetwbc.png",
		},
		{
			new_id: 1,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/news/x9itw6wgfguwsgfgyonn.png",
		},
		{
			new_id: 2,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/news/ijhxmekogxfq9fnetwbc.png",
		},
		{
			new_id: 2,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/news/x9itw6wgfguwsgfgyonn.png",
		},
		{
			new_id: 3,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/news/fud6l529esdqwffemrgj.png",
		},
		{
			new_id: 3,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/news/x9itw6wgfguwsgfgyonn.png",
		},
		{
			new_id: 4,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/news/a2hgx2tsmtisthjlzpbu.jpg",
		},
		{
			new_id: 4,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/news/h6vm7uxhtzozcf220rzy.jpg",
		},
		{
			new_id: 5,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/news/bghldykycnsyg1xazanj.jpg",
		},
		{
			new_id: 5,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/news/qhroy1vazgdtthubzhns.jpg",
		},
		{
			new_id: 5,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/news/ccnp4eywgllmtsyyz4ny.jpg",
		},
		{
			new_id: 6,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/news/qysrmje2lrjzkpwilr7c.jpg",
		},
		{
			new_id: 6,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/news/md3ru5tbqwf2kifgztlc.jpg",
		},
		{
			new_id: 7,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/news/nsddoqd8zrvbpjqp5fzt.jpg",
		},
		{
			new_id: 7,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/news/nmrepwsy7b8jgxhgzaye.jpg",
		},
		{
			new_id: 7,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/news/o5o6e40xxxg9oveiyqve.jpg",
		},
	],

	news_letter: [
		{ email: "josepprn@gmail.com" },
		{ email: "User@esmad.ipp.pt" },
		{ email: "tiago.d.ribeiro@hotmail.com" },
	],

	meetings: [
		{
			school_id: 1,
			creator_id: 1,
			date: "2023-01-16 13:30:00",
			description: "Reunião de professores",
			room: "B108",
			ata: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut molestias, praesentium beatae eum sed facere ea asperiores quam reiciendis rem nobis iste natus, quibusdam consequuntur, iure veniam quas ipsum quis quia aliquid accusamus earum? Nesciunt earum ullam, tempora, tenetur recusandae maxime, cum nemo id nulla eum mollitia. Perspiciatis aliquam, laudantium qui eum vero error reprehenderit. Accusamus amet quia deleniti illum in hic excepturi quo reprehenderit eius voluptatem assumenda eum ipsam aspernatur perferendis aperiam possimus dignissimos reiciendis quae eos laudantium, aliquam non? Illum, qui harum. Accusantium rem reprehenderit eveniet voluptates aliquam facere numquam impedit natus cumque quam, corrupti autem? Expedita nostrum eos explicabo eius excepturi consequatur repellendus corporis in, aliquid nobis tempora rerum necessitatibus, culpa optio vel qui voluptates ipsa magni nisi dolor, sapiente molestiae. Reprehenderit nulla labore quisquam voluptas, laudantium nemo ipsum incidunt dignissimos veniam. Voluptatem, deleniti. Necessitatibus, sequi laborum molestiae pariatur, minus et dicta praesentium rem iusto itaque voluptatum voluptatibus, dolore id sapiente vero ratione. Obcaecati aspernatur exercitationem iste aut distinctio nobis a? Magnam enim ea labore dolore aperiam nobis ullam consequatur? Nesciunt, unde distinctio? Unde excepturi sunt cupiditate, doloremque architecto error quisquam esse, praesentium neque ipsam, optio ad temporibus numquam. Amet pariatur praesentium error accusantium iure officia laborum.",
		},
		{
			school_id: 1,
			creator_id: 1,
			date: "2023-01-16 15:45:00",
			description: "Orientação de alunos",
			room: "B208",
		},
		{
			school_id: 1,
			creator_id: 1,
			date: "2023-01-17 09:00:00",
			description: "Reunião de professores",
			room: "B109",
		},
		{
			school_id: 1,
			creator_id: 1,
			date: "2023-01-17 11:00:00",
			description: "Discussão de projetos",
			room: "online",
		},
		{
			school_id: 1,
			creator_id: 1,
			date: "2023-08-20 14:00:00",
			description: "Uma reunião qualquer",
			room: "B109",
		},
		{
			school_id: 1,
			creator_id: 1,
			date: "2023-12-03 18:25:00",
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut molestias, praesentium beatae eum sed facere ea asperiores quam reiciendis rem nobis iste natus, quibusdam consequuntur, iure veniam quas ipsum quis quia aliquid accusamus earum?",
			room: "B302",
		},
	],

	meeting_ata_image: [
		{
			meeting_id: 1,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/meetings/wgjrxnhwwzc7eqyfydpi.png",
		},
		{
			meeting_id: 1,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/meetings/cw3trxmdfeeq2b7mbrxu.png",
		},
	],

	theme: [
		{ name: "Mar", is_active: true },
		{ name: "Espaços Exteriores", is_active: true },
		{ name: "Água", is_active: true },
		{ name: "Resíduos", is_active: true },
		{ name: "Energia", is_active: false },
		{ name: "Mobilidade / Transportes", is_active: false },
		{ name: "Outro", is_active: true },
	],

	activities: [
		{
			creator_id: 1,
			school_id: 1,
			theme_id: 2,
			title: "Colocação de Caixotes do Lixo",
			complexity: 3,
			initial_date: "2023-07-29",
			final_date: "2023-08-29",
			objective:
				"Contribuir para a limpeza dos espaços exteriores e estimular a utilização das zonas ajardinadas",
			diagnostic: "Falta de local para colocação de lixo nas zonas ajardinadas",
			meta: "Colocação de 10 caixotes do lixo nas zonas relvadas da ESMAD",
			resources: "Caixotes do lixo",
			participants: "Alunos do 1º ano do curso de Design de Jogos Digitais",
			evaluation_indicator: "Número de caixotes do lixo instalados",
			evaluation_method: "Foto dos caixotes do lixo",
			is_finished: false,
		},
		{
			creator_id: 1,
			school_id: 1,
			theme_id: 1,
			title: "Limpeza da Praia + separação de resíduos",
			complexity: 3,
			initial_date: "2023-07-27",
			final_date: "2023-07-28",
			objective:
				"Limpeza de modo a contribuir para o meio ambiente e a prevenir a poluição ambiental",
			diagnostic: "Praia suja",
			meta: "Deixar a praia limpa",
			resources: "Sacos do lixo e luvas",
			participants: "AE ESMAD + Câmara Municipal de Vila do Conde",
			evaluation_indicator: "Número de sacos do lixo cheios",
			evaluation_method: "Foto dos sacos do lixo recolhidos",
			is_finished: false,
		},
		{
			creator_id: 1,
			school_id: 1,
			theme_id: 2,
			title: "Construção de Bancos de Jardim",
			complexity: 3,
			initial_date: "2023-06-29",
			final_date: "2023-07-30",
			objective:
				"Construir bancos de jardim para que os alunos possam descansar e usufruir do espaço exterior da escola",
			diagnostic: "Falta de bancos de jardim no espaço exterior da escola",
			meta: "Construção de 10 bancos de jardim",
			resources: "Madeira, pregos, martelo, serras, lixas, tinta",
			participants: "Alunos do curso de Artes Plásticas",
			evaluation_indicator: "Número de bancos de jardim construídos",
			evaluation_method: "Foto dos bancos de jardim construídos",
			is_finished: false,
		},
		{
			creator_id: 1,
			school_id: 1,
			theme_id: 3,
			title: "Construção de um Sistema de Rega",
			complexity: 4,
			initial_date: "2023-02-10",
			final_date: "2023-04-20",
			objective: "Construir um sistema de rega para que as plantas não morram",
			diagnostic: "Falta de sistema de rega",
			meta: "Construção de um sistema de rega",
			resources: "Tubos, mangueiras, regadores",
			participants: "Alunos do curso de Engenharia Informática",
			evaluation_indicator: "Número de sistemas de rega construídos",
			evaluation_method: "Foto dos sistemas de rega construídos",
			is_finished: true,
			report:
				"O projeto foi finalizado com sucesso, atingindo todos os objetivos estabelecidos. Foram construídos diversos sistemas de rega, com o uso de tubos, mangueiras e regadores, conforme os recursos listados no projeto. Todos os participantes estiveram envolvidos e demonstraram comprometimento durante todo o processo, desde a fase de diagnóstico da falta de sistemas de rega até a fase de construção e avaliação dos sistemas",
		},
		{
			creator_id: 1,
			school_id: 1,
			theme_id: 5,
			title: "Substituição de Lâmpadas",
			complexity: 2,
			initial_date: "2023-01-10",
			final_date: "2023-01-17",
			objective:
				"Substituir as lâmpadas incandescentes por lâmpadas LED, de modo a reduzir o consumo de energia",
			diagnostic: "Lâmpadas incandescentes",
			meta: "Substituição de 100 lâmpadas incandescentes por lâmpadas LED",
			resources: "Lâmpadas LED",
			participants: "Alunos do curso de Engenharia Informática",
			evaluation_indicator: "Número de lâmpadas substituídas",
			evaluation_method: "Foto das lâmpadas substituídas",
			is_finished: true,
			report:
				"O projeto foi finalizado com sucesso, atingindo todos os objetivos estabelecidos. Foram substituídas 100 lâmpadas incandescentes por lâmpadas LED, conforme os recursos listados no projeto. Todos os participantes estiveram envolvidos e demonstraram comprometimento durante todo o processo, desde a fase de diagnóstico da falta de lâmpadas LED até a fase de substituição e avaliação das lâmpadas",
		},
		{
			creator_id: 11,
			school_id: 3,
			theme_id: 6,
			title: "Construção de um Sistema de Recolha de Água da Chuva",
			complexity: 4,
			initial_date: "2023-07-10",
			final_date: "2023-07-20",
			objective: "Construir um sistema de recolha de água da chuva",
			diagnostic: "Falta de sistema de recolha de água da chuva",
			meta: "Construção de um sistema de recolha de água da chuva",
			resources: "Tubos, mangueiras, baldes",
			participants: "Alunos do curso de Engenharia Informática",
			evaluation_indicator: "Número de sistemas de recolha de água da chuva construídos",
			evaluation_method: "Foto dos sistemas de recolha de água da chuva construídos",
			is_finished: false,
		},
		{
			creator_id: 11,
			school_id: 3,
			theme_id: 5,
			title: "Utilização de Energia Solar",
			complexity: 4,
			initial_date: "2023-07-13",
			final_date: "2023-08-20",
			objective: "Utilizar energia solar para reduzir o consumo de energia",
			diagnostic: "Falta de utilização de energia solar",
			meta: "Utilização de energia solar",
			resources: "Painéis solares",
			participants: "Alunos do curso de Engenharia Informática",
			evaluation_indicator: "Número de painéis solares instalados",
			evaluation_method: "Foto dos painéis solares instalados",
			is_finished: false,
		},
	],

	activity_image: [
		{
			activity_id: 1,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/activities/rmeih6o00igae8yngeyl.png",
		},
		{
			activity_id: 1,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/activities/nupdvekgcd4usxuslrz4.png",
		},
		{
			activity_id: 2,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/activities/o63ibdqvhpjokkq3bmvi.png",
		},
		{
			activity_id: 3,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/activities/ekwvvjnh8as2d1xpn9cc.png",
		},
		{
			activity_id: 4,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112588/activities/pq9kkujzgk0lerd2mgft.jpg",
		},
		{
			activity_id: 4,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/activities/gdpnvssx66vwdehvt7ww.jpg",
		},
		{
			activity_id: 5,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112588/activities/im4btkvbqkydcyvmnhgs.jpg",
		},
		{
			activity_id: 5,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112588/activities/sfq1iy7ev9yxisfofvgv.jpg",
		},
		{
			activity_id: 6,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1686163813/activities/images_l3al8o.jpg",
		},
		{
			activity_id: 7,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1686164125/activities/photo-1566093097221-ac2335b09e70-129263_big_djzpye.jpg",
		},
	],

	activity_report_image: [
		{
			activity_id: 4,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112590/reports/anea0cqowasuls1gdalg.png",
		},
		{
			activity_id: 4,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/reports/ypx7kdvstufqqykbhylq.jpg",
		},
		{
			activity_id: 5,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112589/reports/skkssjalm0afsvn41i2v.jpg",
		},
		{
			activity_id: 5,
			img: "https://res.cloudinary.com/dnfd6se6l/image/upload/v1685112588/reports/adwtbjkmwno4kuikoz2j.jpg",
		},
	],

	seeds: [
		{ user_id: 1, amount: 25, date: "2023-02-23" },
		{ user_id: 1, amount: 50, date: "2023-03-20" },
		{ user_id: 1, amount: 100, date: "2023-04-30" },
		{ user_id: 1, amount: 70, date: "2023-05-25" },
		{ user_id: 1, amount: 30, date: "2023-06-10" },
		{ user_id: 1, amount: 50, date: "2023-07-01" },
	],
};

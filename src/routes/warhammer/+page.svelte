<script lang="ts">
</script>

<svelte:head>
	<title>Warhammer</title>
	<meta name="description" content="Warhammer page" />
</svelte:head>

<main>
	<h1>Welcome to Warhammer</h1>
	<section>
		<h2>About Warhammer</h2>
		<p>Warhammer is a tabletop miniature wargame with a rich fantasy universe. Players collect, paint, and battle with armies of miniature figures representing various factions in a grim, dark fantasy world.</p>
	</section>

	<section>
		<h2>Popular Factions</h2>
		<ul>
			<li>Space Marines</li>
			<li>Orks</li>
			<li>Tyranids</li>
			<li>Eldar</li>
			<li>Chaos</li>
		</ul>
	</section>

	<section>
		<h2>Getting Started</h2>
		<p>To begin your journey in the Warhammer universe:</p>
		<ol>
			<li>Choose your faction</li>
			<li>Get your first set of miniatures</li>
			<li>Learn the basic rules</li>
			<li>Start painting your army</li>
			<li>Find local gaming groups</li>
		</ol>
	</section>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: #c41e3a;
		text-align: center;
		margin-bottom: 2rem;
	}

	section {
		margin-bottom: 2rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
	}

	h2 {
		color: #c41e3a;
		margin-bottom: 1rem;
	}

	ul, ol {
		margin-left: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	p {
		line-height: 1.6;
		margin-bottom: 1rem;
	}
</style> 
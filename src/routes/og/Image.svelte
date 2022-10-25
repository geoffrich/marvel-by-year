<script>
	export let text = '1995';
	export let images = [
		'https://i.annihil.us/u/prod/marvel/i/mg/a/00/51f97e7c8da07/portrait_medium.jpg',
		'https://i.annihil.us/u/prod/marvel/i/mg/f/80/5b0eec779ad1f/portrait_medium.jpg',
		'https://i.annihil.us/u/prod/marvel/i/mg/9/a0/5bce079397db1/portrait_medium.jpg',
		'https://i.annihil.us/u/prod/marvel/i/mg/3/90/4f6345543b28d/portrait_medium.jpg',
		'https://i.annihil.us/u/prod/marvel/i/mg/a/30/583ef9b6189bb/portrait_medium.jpg'
	];
</script>

<div
	style="
display: flex; 
flex-direction: column; 
justify-content: flex-start; 
align-items: center; 
width: 100%; 
height: 100%;
background-color: #e03131;
padding: 2rem;"
>
	<p
		style="
    font-size: 90px; 
    color: white; 
    background-color: #e03131;
    "
	>
		{text}
	</p>
	<div style="display: flex; justify-content: space-between; width: 100%; margin-top: 50px;">
		{#each images as image}
			<img src={image} width="200" height="300" alt="" />
		{/each}
	</div>
</div>

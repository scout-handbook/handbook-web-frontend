<?php
	$config = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/client-config.json'), true);
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>
			<?= $config['site-name'] ?>
		</title>
		<link rel="stylesheet" type="text/css" href="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/error.min.css">
	</head>
	<body>
		Prosím povolte Javascript pro zobrazení tohoto webu.
		<br>
		<a href="/">Zpět na hlavní stranu</a>
	</body>
</html>


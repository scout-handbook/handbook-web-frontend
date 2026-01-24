<?php
	$config = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/client-config.json'), true);
?>
<!DOCTYPE html>
<html lang="cs">
	<head>
		<meta charset="utf-8">
		<meta name="author" content="Mlha">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/frontend.min.css">
		<link rel="stylesheet" media="(min-width: 701px)" type="text/css" href="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/frontend-computer.min.css">
		<link rel="stylesheet" media="(max-width: 700px)" type="text/css" href="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/frontend-handheld.min.css">
		<title>
			<?= $config['site-name'] ?>
		</title>
		<link rel="manifest" href="manifest.json">
		<link rel="apple-touch-icon" sizes="180x180" href="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/apple-touch-icon.png">
		<link rel="icon" type="image/png" href="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/favicon-32x32.png" sizes="32x32">
		<link rel="icon" type="image/png" href="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/favicon-16x16.png" sizes="16x16">
		<link rel="mask-icon" href="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/safari-pinned-tab.svg">
		<link rel="shortcut icon" href="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/favicon.ico">
		<meta name="theme-color" content="#ffffff">
		<script defer src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
		<script defer src="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/showdown.min.js"></script>
		<script defer src="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/xss.min.js"></script>
		<script defer src="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/frontend.min.js"></script>
	</head>
	<body>
		<nav>
			<div id="user-account">
				<img id="user-avatar" alt="Account avatar" src="<?= $config['frontend-uri'] . '/' . $config['frontend-resources-path'] ?>/avatar.png">
				<div id="user-name">
					Uživatel nepřihlášen
				</div>
				<div id="log-link"></div>
			</div>
			<div id="nav-container">
				<span id="nav-close-button" class="top-button">Zavřít <i class="icon-cancel"></i></span>
				<h1><a id="lessonOverview" href="enableJS.html">Úvodní strana</a></h1>
				<div id="navigation"></div>
				<h1><a id="competenceOverview" href="enableJS.html">Přehled bodů</a></h1>
			</div>
		</nav>
		<div id="overlay"></div>
		<main>
			<div id="main-container">
				<span id="lessonsButton" class="top-button"><i class="icon-menu"></i> Obsah</span>
				<span id="font-increase" class="top-button">A+</span>
				<span id="font-decrease" class="top-button">A-</span>
				<label id="offline-switch">
					<span class="switch-text top-button">
						Offline
					</span>
					<input type="checkbox" id="cacheOffline">
					<span class="slider"></span>
				</label>
				<div id="content">
					<div id="embedded-spinner"></div>
				</div>
			</div>
		</main>
	</body>
</html>


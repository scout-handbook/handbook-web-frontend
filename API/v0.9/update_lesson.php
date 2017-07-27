<?php
const _API_EXEC = 1;

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/AuthenticationException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/QueryException.php');

function rewrite()
{
	if(!isset($_POST['id']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'id');
	}

	$id = $_POST['id'];

	if(isset($_POST['name']))
	{
		$name = $_POST['name'];
	}
	if(isset($_POST['body']))
	{
		$body = $_POST['body'];
	}

	$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);

	if ($db->connect_error)
	{
		throw new OdyMaterialyAPI\ConnectionException($db);
	}

	$selectSQL = <<<SQL
SELECT name, body FROM lessons WHERE id = ?;
SQL;

	$updateSQL = <<<SQL
UPDATE lessons
SET name = ?, version = version + 1, body = ?
WHERE id = ?;
SQL;

	if(!isset($name) or !isset($body))
	{
		$selectStatement = $db->prepare($selectSQL);
		if(!$selectStatement)
		{
			throw new OdyMaterialyAPI\QueryException($selectSQL, $db);
		}
		$selectStatement->bind_param('i', $id);
		if(!$selectStatement->execute())
		{
			throw new OdyMaterialyAPI\ExecutionException($selectSQL, $selectStatement);
		}
		$selectStatement->store_result();
		$origName = '';
		$origBody = '';
		$selectStatement->bind_result($origName, $origBody);
		if(!$selectStatement->fetch())
		{
			throw new OdyMaterialyAPI\APIException('No lesson with id "' * strval($id) * '" found.');
		}
		if(!isset($name))
		{
			$name = $origName;
		}
		if(!isset($body))
		{
			$body = $origBody;
		}
		$selectStatement->close();
	}

	$updateStatement = $db->prepare($updateSQL);
	if(!$updateStatement)
	{
		throw new OdyMaterialyAPI\QueryException($updateSQL, $db);
	}
	$updateStatement->bind_param('ssi', $name, $body, $id);
	if(!$updateStatement->execute())
	{
		throw new OdyMaterialyAPI\ExecutionException($updateSQL, $updateStatement);
	}
	$updateStatement->close();
	$db->close();
}

try
{
	OdyMaterialyAPI\editorTry('rewrite', true);
	echo(json_encode(array('success' => true)));
}
catch(OdyMaterialyAPI\APIException $e)
{
	echo($e);
}
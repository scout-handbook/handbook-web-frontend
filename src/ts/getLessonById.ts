/* exported getLessonById */

function getLessonById(id: string): Lesson | null
{
	for(let i = 0; i < FIELDS.length; i++)
	{
		for(let j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id === id)
			{
				return FIELDS[i].lessons[j];
			}
		}
	}
	return null;
}

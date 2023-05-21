using Backend_app.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend_app.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly QuizDbContext _context;
        public QuestionController(QuizDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
        {

            var random5Qns = await (_context.Questions
                .Select(q => new
                {
                    QnId = q.QnId,
                    QnInWords = q.QnInWords,
                    ImageName = q.ImageName,
                    Options = new string[] { q.Option1, q.Option2, q.Option3, q.Option4 }
                })
                .OrderBy(q => Guid.NewGuid())
                .Take(5)
                ).ToListAsync();

            return Ok(random5Qns);
        }


        // POST : api/Question/GetAnswers
        [HttpPost]
        [Route("GetAnswers")]
        public async Task<ActionResult<Question>> RetrieveAnswers(int[] qnIds)
        {
            var answers = await (_context.Questions
                .Where(q => qnIds.Contains(q.QnId))
                .Select(q => new
                {
                    QnId = q.QnId,
                    QnInWords = q.QnInWords,
                    ImageName = q.ImageName,
                    Options = new string[] { q.Option1, q.Option2, q.Option3, q.Option4 },
                    Answer = q.Answer
                })).ToListAsync();

            return Ok(answers);

        }
    }
}

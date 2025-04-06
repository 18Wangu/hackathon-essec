# analysewebsite/src/analysewebsite/crew.py
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import ScrapeWebsiteTool

@CrewBase
class WebsiteSecurityCrew():
    """Crew for Website Security Analysis"""

    @agent
    def security_researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['security_researcher'],
            verbose=True,
            tools=[ScrapeWebsiteTool()]
        )

    @agent
    def security_reporter(self) -> Agent:
        return Agent(
            config=self.agents_config['security_reporter'],
            verbose=True
        )

    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config['research_task'],
        )

    @task
    def reporting_task(self) -> Task:
        return Task(
            config=self.tasks_config['reporting_task'],
            output_file='output/report.md'
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Website Security Analysis crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )

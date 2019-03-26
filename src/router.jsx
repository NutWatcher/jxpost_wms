import React from 'react';
import { Route } from 'react-router-dom';
import CourseContent from './page/courseContent.jsx';
import LessonContent from './page/lessonContent.jsx';
import About from './page/about.jsx';
import Index from './page/Index.jsx';

export let MyRouter = () => {
    return (
        <div>
            <Route exact path="/" component={Index}>
            </Route>
            <Route path="/courseContent" component={CourseContent}>
            </Route>
            <Route path="/lessonContent" component={LessonContent}>
            </Route>
            <Route path="/about" component={About}>
            </Route>
        </div>
    );
};
